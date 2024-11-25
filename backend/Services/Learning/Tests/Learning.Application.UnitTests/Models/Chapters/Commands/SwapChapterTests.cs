using NUnit.Framework;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Learning.Application.Models.Chapters.Commands.SwapChapter;

namespace Learning.Application.UnitTests.Models.Chapters.Commands.SwapChapter
{
    [TestFixture]
    public class SwapChapterHandlerTests
    {
        private Mock<IChapterRepository> _chapterRepositoryMock;
        private Mock<ICourseRepository> _courseRepositoryMock;
        private SwapChapterHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _chapterRepositoryMock = new Mock<IChapterRepository>();
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _handler = new SwapChapterHandler(_chapterRepositoryMock.Object, _courseRepositoryMock.Object);
        }

        [Test]
        public async Task Handler_ShouldSwapChaptersSuccessfully_WhenValidRequest()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var course = SwapChapterTestData.GetValidCourse();
            var (chapter1, chapter2) = SwapChapterTestData.GetValidChapters(course.Id.Value);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync(chapter2);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(chapter1.CourseId.Value))
                .ReturnsAsync(course);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.AreEqual(2, result.OrderIndexChapter1); // chapter1's new OrderIndex
            Assert.AreEqual(1, result.OrderIndexChapter2); // chapter2's new OrderIndex

            _chapterRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<Chapter>(c => c.Id == chapter1.Id && c.OrderIndex == 2)), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<Chapter>(c => c.Id == chapter2.Id && c.OrderIndex == 1)), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }


        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenChapter1DoesNotExist()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync((Chapter)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo($"Entity \"Chapter\" ({command.ChapterId1}) was not found."));
        }


        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenChapter2DoesNotExist()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var chapter1 = SwapChapterTestData.GetChapter(command.ChapterId1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync((Chapter)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo($"Entity \"Chapter\" ({command.ChapterId2}) was not found."));
        }


        [Test]
        public void Handler_ShouldThrowConflictException_WhenChaptersDoNotBelongToSameCourse()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var chapter1 = SwapChapterTestData.GetChapter(command.ChapterId1, courseId: Guid.NewGuid());
            var chapter2 = SwapChapterTestData.GetChapter(command.ChapterId2, courseId: Guid.NewGuid());

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync(chapter2);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ConflictException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Chapters do not belong to the same course."));
        }


        [Test]
        public async Task Handler_ShouldNotUpdate_WhenChaptersAlreadySwapped()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var course = SwapChapterTestData.GetValidCourse();
            var (chapter1, chapter2) = SwapChapterTestData.GetValidChapters(course.Id.Value);

            chapter1.OrderIndex = 2;
            chapter2.OrderIndex = 1;

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync(chapter2);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(chapter1.CourseId.Value))
                .ReturnsAsync(course);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);
        }


        [Test]
        public void Handler_ShouldThrowConflictException_WhenOneChapterBelongsToAnotherCourse()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var course1 = SwapChapterTestData.GetValidCourse();
            var course2 = SwapChapterTestData.GetValidCourse();
            var chapter1 = SwapChapterTestData.GetChapter(command.ChapterId1, course1.Id.Value);
            var chapter2 = SwapChapterTestData.GetChapter(command.ChapterId2, course2.Id.Value);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync(chapter2);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ConflictException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Chapters do not belong to the same course."));
        }

        [Test]
        public void Handler_ShouldThrowException_WhenCourseIdIsNull()
        {
            // Arrange
            var command = SwapChapterTestData.GetValidSwapChapterCommand();
            var chapter1 = SwapChapterTestData.GetChapter(command.ChapterId1, courseId: null);
            var chapter2 = SwapChapterTestData.GetChapter(command.ChapterId2, courseId: Guid.NewGuid());

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId1))
                .ReturnsAsync(chapter1);

            _chapterRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.ChapterId2))
                .ReturnsAsync(chapter2);

            // Act & Assert
            var ex = Assert.ThrowsAsync<ConflictException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain("Chapters do not belong to the same course."));
        }


    }
}