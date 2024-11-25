using BuidingBlocks.Storage;
using Learning.Application.Models.Files.Commands.CreateFile;
using Learning.Application.UnitTests.Models.Files.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Files.Commands
{
    [TestFixture]
    public class CreateFileHandlerTests
    {
        private Mock<IFilesService> _filesServiceMock;
        private Mock<IFileRepository> _fileRepositoryMock;
        private Mock<ILectureRepository> _lectureRepositoryMock;
        private CreateFileHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _filesServiceMock = new Mock<IFilesService>();
            _fileRepositoryMock = new Mock<IFileRepository>();
            _lectureRepositoryMock = new Mock<ILectureRepository>();
            _handler = new CreateFileHandler(
                _filesServiceMock.Object,
                _fileRepositoryMock.Object,
                _lectureRepositoryMock.Object
            );
        }

        [Test]
        public async Task Handler_ShouldCreateFileSuccessfully_WhenValidRequest()
        {
            // Arrange
            var command = CreateFileTestData.GetValidCreateFileCommand();
            var lecture = CreateFileTestData.GetValidLecture();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync(lecture);

            _filesServiceMock
                .Setup(service => service.UploadFileAsync(
                    command.CreateFileDto.File,
                    StorageConstants.BUCKET,
                    StorageConstants.DOCUMENT_PATH))
                .ReturnsAsync("valid-file-name.docx");

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.AreNotEqual(Guid.Empty, result.Id);

            _fileRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Domain.Models.File>()), Times.Once);
            _fileRepositoryMock.Verify(repo => repo.SaveChangesAsync(CancellationToken.None), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenLectureDoesNotExist()
        {
            // Arrange
            var command = CreateFileTestData.GetValidCreateFileCommand();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync((Lecture)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Lecture\" ({command.LectureId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowArgumentException_WhenFileTypeIsInvalid()
        {
            // Arrange
            var command = CreateFileTestData.GetInvalidFileTypeCommand();
            var lecture = CreateFileTestData.GetValidLecture();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync(lecture);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Invalid file type provided."));
        }

        [Test]
        public async Task Handler_ShouldCreateFileWithCorrectUrl_WhenValidVideoFile()
        {
            // Arrange
            var command = CreateFileTestData.GetValidVideoFileCommand();
            var lecture = CreateFileTestData.GetValidLecture();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync(lecture);

            _filesServiceMock
                .Setup(service => service.UploadFileAsync(
                    command.CreateFileDto.File,
                    StorageConstants.BUCKET,
                    StorageConstants.VIDEO_PATH))
                .ReturnsAsync("video-file.mp4");

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.AreNotEqual(Guid.Empty, result.Id);

            _fileRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Domain.Models.File>()), Times.Once);
            _fileRepositoryMock.Verify(repo => repo.SaveChangesAsync(CancellationToken.None), Times.Once);
        }

        [Test]
        public async Task Handler_ShouldCreateFileWithCorrectDuration_WhenVideoFileWithDuration()
        {
            // Arrange
            var command = CreateFileTestData.GetValidVideoFileWithDurationCommand();
            var lecture = CreateFileTestData.GetValidLecture();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync(lecture);

            _filesServiceMock
                .Setup(service => service.UploadFileAsync(
                    command.CreateFileDto.File,
                    StorageConstants.BUCKET,
                    StorageConstants.VIDEO_PATH))
                .ReturnsAsync("video-file.mp4");

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.AreNotEqual(Guid.Empty, result.Id);

            _fileRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Domain.Models.File>(file => file.Duration == 300)), Times.Once);
            _fileRepositoryMock.Verify(repo => repo.SaveChangesAsync(CancellationToken.None), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowException_WhenLectureIdIsInvalid()
        {
            // Arrange
            var command = CreateFileTestData.GetValidCreateFileCommand();

            _lectureRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.LectureId))
                .ReturnsAsync((Lecture)null); // Lecture không tồn tại

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Lecture\" ({command.LectureId}) was not found."));
        }
    }
}
