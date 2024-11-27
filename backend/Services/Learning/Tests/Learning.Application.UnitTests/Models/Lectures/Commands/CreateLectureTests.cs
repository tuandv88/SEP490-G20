using Learning.Application.Models.Lectures.Commands.CreateLecture;
using Learning.Application.UnitTests.Models.Lectures.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Lectures.Commands
{
    [TestFixture]
    public class CreateLectureHandlerTests
    {
        private Mock<IChapterRepository> _chapterRepositoryMock;
        private Mock<ILectureRepository> _lectureRepositoryMock;
        private CreateLectureHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _chapterRepositoryMock = new Mock<IChapterRepository>();
            _lectureRepositoryMock = new Mock<ILectureRepository>();
            _handler = new CreateLectureHandler(
                _chapterRepositoryMock.Object,
                _lectureRepositoryMock.Object
            );
        }

        [Test]
        public async Task Handler_ShouldCreateLectureSuccessfully_WhenValidRequest()
        {
            // Arrange
            var command = CreateLectureTestData.GetValidCreateLectureCommand();
            var chapter = CreateLectureTestData.GetValidChapter();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync(chapter);

            _lectureRepositoryMock
                .Setup(repo => repo.CountByChapterAsync(command.ChapterId))
                .ReturnsAsync(1);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.AreNotEqual(Guid.Empty, result.Id);
            _lectureRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Lecture>()), Times.Once);
            _lectureRepositoryMock.Verify(repo => repo.SaveChangesAsync(CancellationToken.None), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenChapterDoesNotExist()
        {
            // Arrange
            var command = CreateLectureTestData.GetValidCreateLectureCommand();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync((Chapter)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo($"Entity \"Chapter\" ({command.ChapterId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowArgumentOutOfRangeException_WhenLectureTypeIsInvalid()
        {
            // Arrange
            var command = CreateLectureTestData.GetInvalidLectureTypeCommand();
            var chapter = CreateLectureTestData.GetValidChapter();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync(chapter);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Value '{command.CreateLectureDto.LectureType}' is not valid for LectureType."));
        }

        [Test]
        public async Task Handler_ShouldAddLectureToChapter_WhenValidRequest()
        {
            // Arrange
            var command = CreateLectureTestData.GetValidCreateLectureCommand();
            var chapter = CreateLectureTestData.GetValidChapter();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync(chapter);

            _lectureRepositoryMock
                .Setup(repo => repo.CountByChapterAsync(command.ChapterId))
                .ReturnsAsync(1);

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.AreEqual(1, chapter.Lectures.Count);
            Assert.AreEqual(command.CreateLectureDto.Title, chapter.Lectures[0].Title);
        }

        [Test]
        public async Task Handler_ShouldSetOrderIndexCorrectly_WhenValidRequest()
        {
            // Arrange
            var command = CreateLectureTestData.GetValidCreateLectureCommand();
            var chapter = CreateLectureTestData.GetValidChapter();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync(chapter);

            _lectureRepositoryMock
                .Setup(repo => repo.CountByChapterAsync(command.ChapterId))
                .ReturnsAsync(2);

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.AreEqual(1, chapter.Lectures[0].OrderIndex); 
        }

        [Test]
        public void Handler_ShouldThrowException_WhenSaveChangesFails()
        {
            // Arrange
            var command = CreateLectureTestData.GetValidCreateLectureCommand();
            var chapter = CreateLectureTestData.GetValidChapter();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId))
                .ReturnsAsync(chapter);

            _lectureRepositoryMock
                .Setup(repo => repo.CountByChapterAsync(command.ChapterId))
                .ReturnsAsync(1);

            _lectureRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(CancellationToken.None))
                .ThrowsAsync(new Exception("Save changes failed."));

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Save changes failed."));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenLectureTypeIsInvalid()
        {
            // Arrange
            var command = CreateLectureTestData.GetInvalidLectureTypeCommand();
            var validator = new CreateLectureCommandValidator();

            // Act
            var result = validator.Validate(command);

            // Assert
            Assert.IsFalse(result.IsValid);
            Assert.IsTrue(result.Errors.Any(e => e.ErrorMessage.Contains("Lecture type must be a valid value (Lesson, Quiz, Practice).")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenTitleIsNull()
        {
            // Arrange
            var command = CreateLectureTestData.GetCreateLectureCommandWithNullTitle();
            var validator = new CreateLectureCommandValidator();

            // Act
            var result = validator.Validate(command);

            // Assert
            Assert.IsFalse(result.IsValid);
            Assert.IsTrue(result.Errors.Any(e => e.ErrorMessage.Contains("Title must not be null.")));
        }

        [Test]
        public void Handler_ShouldThrowValidationException_WhenTimeEstimationIsZero()
        {
            // Arrange
            var command = CreateLectureTestData.GetCreateLectureCommandWithZeroTimeEstimation();
            var validator = new CreateLectureCommandValidator();

            // Act
            var result = validator.Validate(command);

            // Assert
            Assert.IsFalse(result.IsValid);
            Assert.IsTrue(result.Errors.Any(e => e.ErrorMessage.Contains("Time estimation must be greater than zero.")));
        }

    }
}
