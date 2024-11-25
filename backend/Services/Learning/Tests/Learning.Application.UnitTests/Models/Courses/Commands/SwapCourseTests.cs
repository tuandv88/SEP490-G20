using Learning.Application.Models.Courses.Commands.SwapCourse;
using Learning.Domain.ValueObjects;
using Learning.Tests.Application.UnitTest.Models.Course.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Course.Commands;

[TestFixture]
public class SwapCourseTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private SwapCourseHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();
        _handler = new SwapCourseHandler(_repositoryMock.Object);
    }

    [Test]
    public async Task Handler_ShouldSwapCourses_WhenValidRequest()
    {
        // Arrange
        var command = SwapCourseTestData.GetValidSwapCourseCommand();

        var course1 = new Learning.Domain.Models.Course
        {
            Id = CourseId.Of(command.CourseId1),
            OrderIndex = 1
        };
        var course2 = new Learning.Domain.Models.Course
        {
            Id = CourseId.Of(command.CourseId2),
            OrderIndex = 2
        };

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId1))
            .ReturnsAsync(course1);

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId2))
            .ReturnsAsync(course2);

        _repositoryMock
            .Setup(repo => repo.UpdateAsync(It.IsAny<Learning.Domain.Models.Course>()))
            .Returns(Task.CompletedTask);

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(1));

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.AreEqual(2, result.OrderIndexCourse1);
        Assert.AreEqual(1, result.OrderIndexCourse2);
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourse1NotFound()
    {
        // Arrange
        var command = SwapCourseTestData.GetInvalidSwapCourseCommand_NonexistentCourse1();

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId1))
            .ReturnsAsync((Learning.Domain.Models.Course)null); // Simulating course1 not found

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId2))
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(command.CourseId2), OrderIndex = 2 });

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Course with ID '{command.CourseId1}' was not found."));
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourse2NotFound()
    {
        // Arrange
        var command = SwapCourseTestData.GetInvalidSwapCourseCommand_NonexistentCourse2();

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId1))
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(command.CourseId1), OrderIndex = 1 });

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId2))
            .ReturnsAsync((Learning.Domain.Models.Course)null); // Simulating course2 not found

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Course with ID '{command.CourseId2}' was not found."));
    }
}
