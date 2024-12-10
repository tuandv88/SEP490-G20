using Learning.Application.Models.Courses.Commands.UpdateLectureProgress;
using Learning.Domain.Models;
using Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Commands;

[TestFixture]
public class UpdateLectureProgressTests
{
    private Mock<IUserEnrollmentRepository> _userCourseRepositoryMock;
    private Mock<IUserContextService> _userContextMock;
    private Mock<ICourseRepository> _courseRepositoryMock;
    private UpdateLectureProgressHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _userCourseRepositoryMock = new Mock<IUserEnrollmentRepository>();
        _userContextMock = new Mock<IUserContextService>();
        _courseRepositoryMock = new Mock<ICourseRepository>();

        _handler = new UpdateLectureProgressHandler(
            _userCourseRepositoryMock.Object,
            _userContextMock.Object,
            _courseRepositoryMock.Object
        );

        _userContextMock.Setup(x => x.User.Id).Returns(Guid.NewGuid());
    }

    [Test]
    public async Task Handler_ShouldUpdateProgress_WhenValidRequest()
    {
        // Arrange
        var command = UpdateLectureProgressTestData.GetValidUpdateLectureProgressCommand();
        var userId = _userContextMock.Object.User.Id;

        var course = new Learning.Domain.Models.Course
        {
            Id = CourseId.Of(command.CourseId),
            Chapters = new List<Chapter>
            {
                new Chapter
                {
                    Lectures = new List<Lecture>
                    {
                        new Lecture { Id = LectureId.Of(command.LectureId) }
                    }
                }
            }
        };

        var userCourse = new UserEnrollment
        {
            Id = UserEnrollmentId.Of(Guid.NewGuid()),
            LectureProgress = new List<LectureProgress>()
        };

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
            .ReturnsAsync(course);

        _userCourseRepositoryMock
            .Setup(repo => repo.GetByUserIdAndCourseIdWithProgressAsync(userId, command.CourseId))
            .ReturnsAsync(userCourse);

        _userCourseRepositoryMock
            .Setup(repo => repo.UpdateAsync(It.IsAny<UserEnrollment>()))
            .Returns(Task.CompletedTask);

        _userCourseRepositoryMock
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(1));

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsTrue(result.IsSuccess);
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourseNotFound()
    {
        // Arrange
        var command = UpdateLectureProgressTestData.GetInvalidUpdateLectureProgressCommand_NonexistentCourse();

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
            .ReturnsAsync((Learning.Domain.Models.Course)null); // Simulating course not found

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenLectureNotFound()
    {
        // Arrange
        var command = UpdateLectureProgressTestData.GetInvalidUpdateLectureProgressCommand_NonexistentLecture();

        var course = new Learning.Domain.Models.Course
        {
            Id = CourseId.Of(command.CourseId),
            Chapters = new List<Chapter>() // No lectures in the course
        };

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
            .ReturnsAsync(course);

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Entity \"Lecture\" ({command.LectureId}) was not found."));
    }

}
