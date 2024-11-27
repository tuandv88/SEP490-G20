using BuidingBlocks.Storage;
using Learning.Application.Models.Files.Commands.DeleteFile;
using Learning.Application.UnitTests.Models.Files.Helpers;

namespace Learning.Application.UnitTests.Models.Files.Commands
{
    [TestFixture]
    public class DeleteFileHandlerTests
    {
        private Mock<ILectureRepository> _lectureRepositoryMock;
        private Mock<IFileRepository> _fileRepositoryMock;
        private Mock<IFilesService> _filesServiceMock;
        private DeleteFileHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _lectureRepositoryMock = new Mock<ILectureRepository>();
            _fileRepositoryMock = new Mock<IFileRepository>();
            _filesServiceMock = new Mock<IFilesService>();
            _handler = new DeleteFileHandler(
                _lectureRepositoryMock.Object,
                _fileRepositoryMock.Object,
                _filesServiceMock.Object
            );
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenLectureDoesNotExist()
        {
            // Arrange
            var command = DeleteFileTestData.GetValidDeleteFileCommand();

            _lectureRepositoryMock
                .Setup(repo => repo.GetLectureByIdDetail(command.LectureId))
                .ReturnsAsync((Lecture)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Lecture\" ({command.LectureId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenFileDoesNotExistInLecture()
        {
            // Arrange
            var command = DeleteFileTestData.GetValidDeleteFileCommand();
            var lecture = DeleteFileTestData.GetLectureWithoutFile(command.LectureId);

            _lectureRepositoryMock
                .Setup(repo => repo.GetLectureByIdDetail(command.LectureId))
                .ReturnsAsync(lecture);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"File\" ({command.FileId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowException_WhenDeleteFileFails()
        {
            // Arrange
            var command = DeleteFileTestData.GetValidDeleteFileCommand();
            var lecture = DeleteFileTestData.GetLectureWithFile(command.LectureId, command.FileId);

            _lectureRepositoryMock
                .Setup(repo => repo.GetLectureByIdDetail(command.LectureId))
                .ReturnsAsync(lecture);

            _filesServiceMock
                .Setup(service => service.DeleteFileAsync(StorageConstants.BUCKET, It.IsAny<string>()))
                .ThrowsAsync(new Exception("Delete failed."));

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Delete failed."));
        }

        [Test]
        public async Task Handler_ShouldRemoveFileFromLecture_WhenValidRequest()
        {
            // Arrange
            var command = DeleteFileTestData.GetValidDeleteFileCommand();
            var lecture = DeleteFileTestData.GetLectureWithFile(command.LectureId, command.FileId);

            _lectureRepositoryMock
                .Setup(repo => repo.GetLectureByIdDetail(command.LectureId))
                .ReturnsAsync(lecture);

            _filesServiceMock
                .Setup(service => service.DeleteFileAsync(StorageConstants.BUCKET, It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.IsEmpty(lecture.Files);
            _fileRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Domain.Models.File>()), Times.Once);
        }
    }
}
