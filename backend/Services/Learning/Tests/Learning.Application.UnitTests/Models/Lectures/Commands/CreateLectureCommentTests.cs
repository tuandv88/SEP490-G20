using Learning.Application.Models.Lectures.Commands.CreateLectureComment;
using Learning.Application.UnitTests.Models.Lectures.Helpers;

namespace Learning.Application.UnitTests.Models.Lectures.Commands
{
    [TestFixture]
    public class CreateLectureCommentHandlerTests
    {
        private Mock<ICourseRepository> _courseRepositoryMock;
        private Mock<IUserContextService> _userContextMock;
        private Mock<IUserEnrollmentRepository> _userCourseRepositoryMock;
        private Mock<ILectureCommentRepository> _lectureCommentRepositoryMock;
        private CreateLectureCommentHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _userContextMock = new Mock<IUserContextService>();
            _userCourseRepositoryMock = new Mock<IUserEnrollmentRepository>();
            _lectureCommentRepositoryMock = new Mock<ILectureCommentRepository>();

            _handler = new CreateLectureCommentHandler(
                _courseRepositoryMock.Object,
                _userContextMock.Object,
                _userCourseRepositoryMock.Object,
                _lectureCommentRepositoryMock.Object
            );
        }

        [Test]
        public async Task Handler_ShouldCreateCommentSuccessfully_WhenValidRequest()
        {
            // Arrange
            var command = CreateLectureCommentTestData.GetValidCreateLectureCommentCommand();
            var course = CreateLectureCommentTestData.GetCourseWithLecture(command.CourseId, command.LectureId);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _userContextMock
                .Setup(context => context.User.Id)
                .Returns(Guid.NewGuid());

            _userCourseRepositoryMock
                .Setup(repo => repo.GetByUserIdAndCourseIdWithProgressAsync(It.IsAny<Guid>(), command.CourseId))
                .ReturnsAsync(CreateLectureCommentTestData.GetValidUserCourse());

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.AreNotEqual(Guid.Empty, result.Id);
            _lectureCommentRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<LectureComment>()), Times.Once);
            _lectureCommentRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
        {
            // Arrange
            var command = CreateLectureCommentTestData.GetValidCreateLectureCommentCommand();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowForbiddenAccessException_WhenUserNotEnrolledInCourse()
        {
            // Arrange
            var command = CreateLectureCommentTestData.GetValidCreateLectureCommentCommand();
            var course = CreateLectureCommentTestData.GetCourseWithLecture(command.CourseId, command.LectureId);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _userContextMock
                .Setup(context => context.User.Id)
                .Returns(Guid.NewGuid());

            _userCourseRepositoryMock
                .Setup(repo => repo.GetByUserIdAndCourseIdWithProgressAsync(It.IsAny<Guid>(), command.CourseId))
                .ReturnsAsync((UserEnrollment)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ForbiddenAccessException>(() => _handler.Handle(command, CancellationToken.None));

            // Kiểm tra kiểu của exception thay vì thông báo
            Assert.That(ex, Is.InstanceOf<ForbiddenAccessException>());
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenLectureDoesNotExist()
        {
            // Arrange
            var command = CreateLectureCommentTestData.GetValidCreateLectureCommentCommand();
            var course = CreateLectureCommentTestData.GetCourseWithoutLecture(command.CourseId);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _userContextMock
                .Setup(context => context.User.Id)
                .Returns(Guid.NewGuid());

            _userCourseRepositoryMock
                .Setup(repo => repo.GetByUserIdAndCourseIdWithProgressAsync(It.IsAny<Guid>(), command.CourseId))
                .ReturnsAsync(CreateLectureCommentTestData.GetValidUserCourse());

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo($"Entity \"Lecture\" ({command.LectureId}) was not found."));
        }
    }
}
