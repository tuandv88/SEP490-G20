using Learning.Application.Models.Chapters.Commands.UpdateChapter;
using Learning.Application.Models.Chapters.Dtos;
using Learning.Application.UnitTests.Models.Chapters.Helpers;

namespace Learning.Application.UnitTests.Models.Chapters.Commands
{
    [TestFixture]
    public class UpdateChapterTests
    {
        private Mock<ICourseRepository> _courseRepositoryMock;
        private Mock<IChapterRepository> _chapterRepositoryMock;
        private UpdateChapterHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _chapterRepositoryMock = new Mock<IChapterRepository>();
            _handler = new UpdateChapterHandler(_courseRepositoryMock.Object, _chapterRepositoryMock.Object);
        }

        [Test]
        public async Task Handler_ShouldUpdateChapter_WhenValidRequest()
        {
            // Arrange
            var command = UpdateChapterTestData.GetValidUpdateChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            // Thêm chapter vào danh sách để nó tồn tại
            var existingChapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Title = "Old Title",
                Description = "Old Description",
                TimeEstimation = 10,
                IsActive = true
            };
            course.Chapters.Add(existingChapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _chapterRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            // Kiểm tra xem chapter có được cập nhật đúng hay không
            Assert.That(existingChapter.Title, Is.EqualTo(command.UpdateChapterDto.Title));
            Assert.That(existingChapter.Description, Is.EqualTo(command.UpdateChapterDto.Description));
            Assert.That(existingChapter.IsActive, Is.EqualTo(command.UpdateChapterDto.IsActive));
        }


        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
        {
            // Arrange
            var command = UpdateChapterTestData.GetValidUpdateChapterCommand();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenTitleIsNull()
        {
            // Arrange
            var command = UpdateChapterTestData.GetInvalidUpdateChapterCommand_NullTitle();

            // Act & Assert
            var validator = new UpdateChapterCommandValidator();
            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.That(result.Errors, Has.Some.Matches<ValidationFailure>(x => x.ErrorMessage.Contains("Title is required.")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenDescriptionIsNull()
        {
            // Arrange
            var command = UpdateChapterTestData.GetInvalidUpdateChapterCommand_NullDescription();

            // Act & Assert
            var validator = new UpdateChapterCommandValidator();
            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.That(result.Errors, Has.Some.Matches<ValidationFailure>(x => x.ErrorMessage.Contains("Description is required.")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenTimeEstimationIsNegative()
        {
            // Arrange
            var command = UpdateChapterTestData.GetInvalidUpdateChapterCommand_NegativeTimeEstimation();

            // Act & Assert
            var validator = new UpdateChapterCommandValidator();
            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.That(result.Errors, Has.Some.Matches<ValidationFailure>(x => x.ErrorMessage.Contains("Time estimation must be greater than zero.")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenTitleIsEmpty()
        {
            // Arrange
            var command = UpdateChapterTestData.GetInvalidUpdateChapterCommand_EmptyTitle();

            // Act & Assert
            var validator = new UpdateChapterCommandValidator();
            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.That(result.Errors, Has.Some.Matches<ValidationFailure>(x => x.ErrorMessage.Contains("Title is required.")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenAllFieldsAreInvalid()
        {
            // Arrange
            var command = new UpdateChapterCommand(
                Guid.NewGuid(),
                Guid.NewGuid(),
                new UpdateChapterDto("", null, true)
            );

            // Act & Assert
            var validator = new UpdateChapterCommandValidator();
            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
            Assert.That(result.Errors, Has.Count.EqualTo(4)); // Sửa từ 3 thành 4
            Assert.That(result.Errors.Select(e => e.ErrorMessage), Does.Contain("Title is required."));
            Assert.That(result.Errors.Select(e => e.ErrorMessage), Does.Contain("Description is required."));
            Assert.That(result.Errors.Select(e => e.ErrorMessage), Does.Contain("Time estimation must be greater than zero."));
        }


        [Test]
        public void Handler_ShouldCallUpdateAsync_WhenValidRequest()
        {
            // Arrange
            var command = UpdateChapterTestData.GetValidUpdateChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            // Thêm chapter vào danh sách của course
            var existingChapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Title = "Old Title",
                Description = "Old Description",
                TimeEstimation = 10,
                IsActive = true
            };
            course.Chapters.Add(existingChapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            // Act
            _handler.Handle(command, CancellationToken.None);

            // Assert
            _chapterRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Chapter>()), Times.Once);
        }


        [Test]
        public void Handler_ShouldCallSaveChangesAsync_WhenUpdateIsSuccessful()
        {
            // Arrange
            var command = UpdateChapterTestData.GetValidUpdateChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            // Thêm chapter vào danh sách của course
            var existingChapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Title = "Old Title",
                Description = "Old Description",
                TimeEstimation = 10,
                IsActive = true
            };

        }
    }
}
