using Learning.Application.Models.Courses.Commands.CreateEnrollmentCourse;
using Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Commands;

[TestFixture]
public class CreateEnrollmentCourseTests
{
    private Mock<IUserCourseRepository> _userCourseRepositoryMock;
    private Mock<ICourseRepository> _courseRepositoryMock;
    private Mock<IUserContextService> _userContextMock;
    private EnrollmentCourseHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _userCourseRepositoryMock = new Mock<IUserCourseRepository>();
        _courseRepositoryMock = new Mock<ICourseRepository>();
        _userContextMock = new Mock<IUserContextService>();

        _handler = new EnrollmentCourseHandler(
            _userCourseRepositoryMock.Object,
            _courseRepositoryMock.Object,
            _userContextMock.Object
        );

        _userContextMock.Setup(x => x.User.Id).Returns(Guid.NewGuid());
    }

    [Test]
    public async Task Handler_ShouldEnrollUser_WhenValidRequest()
    {
        var command = CreateEnrollmentCourseTestData.GetValidCreateEnrollmentCourseCommand();
        var userId = _userContextMock.Object.User.Id;

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                Price = 0,
                CourseStatus = CourseStatus.Published
            });

        _userCourseRepositoryMock
            .Setup(repo => repo.GetByUserIdAndCourseIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync((Learning.Domain.Models.UserCourse)null);

        _userCourseRepositoryMock
             .Setup(repo => repo.AddAsync(It.IsAny<Learning.Domain.Models.UserCourse>()))
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
        var command = CreateEnrollmentCourseTestData.GetInvalidCreateEnrollmentCourseCommand_NonexistentCourse();

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Learning.Domain.Models.Course)null); // Simulating course not found

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
    }

    [Test]
    public async Task Handler_ShouldReturnTrue_WhenUserAlreadyEnrolled()
    {
        var command = CreateEnrollmentCourseTestData.GetValidCreateEnrollmentCourseCommand_AlreadyEnrolled();
        var userId = _userContextMock.Object.User.Id;

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                Price = 0,
                CourseStatus = CourseStatus.Published
            });

        _userCourseRepositoryMock
            .Setup(repo => repo.GetByUserIdAndCourseIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.UserCourse()); // Simulating already enrolled

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsTrue(result.IsSuccess);
    }

    [Test]
    public async Task Handler_ShouldFail_WhenCourseIsNotFree()
    {
        var command = CreateEnrollmentCourseTestData.GetInvalidCreateEnrollmentCourseCommand_PaidCourse();

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                Price = 100, // Paid course
                CourseStatus = CourseStatus.Published
            });

        _userCourseRepositoryMock
            .Setup(repo => repo.GetByUserIdAndCourseIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync((Learning.Domain.Models.UserCourse)null);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsFalse(result.IsSuccess);
    }

    [Test]
    public async Task Handler_ShouldFail_WhenCourseIsNotPublished()
    {
        var command = CreateEnrollmentCourseTestData.GetInvalidCreateEnrollmentCourseCommand_UnpublishedCourse();

        _courseRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                Price = 0,
                CourseStatus = CourseStatus.Draft // Unpublished course
            });

        _userCourseRepositoryMock
            .Setup(repo => repo.GetByUserIdAndCourseIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync((Learning.Domain.Models.UserCourse)null);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsFalse(result.IsSuccess);
    }
}

