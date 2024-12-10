using Learning.Application.Models.Chapters.Commands.CreateChapter;
using Learning.Application.Models.Chapters.Dtos;
using Learning.Application.UnitTests.Models.Chapters.Helpers;

namespace Learning.Application.UnitTests.Models.Chapters.Commands
{
    [TestFixture]
    public class CreateChapterHandlerTests
    {
        private Mock<ICourseRepository> _courseRepositoryMock;
        private Mock<IChapterRepository> _chapterRepositoryMock;
        private CreateChapterHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _chapterRepositoryMock = new Mock<IChapterRepository>();
            _handler = new CreateChapterHandler(_courseRepositoryMock.Object, _chapterRepositoryMock.Object);
        }

        [Test]
        public async Task Handler_ShouldCreateChapter_WhenValidRequest()
        {
            // Arrange
            var command = CreateChapterTestData.GetValidCreateChapterCommand();
            var course = new Learning.Domain.Models.Course { Id = CourseId.Of(command.CourseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.CountByCourseAsync(It.IsAny<Guid>()))
                .ReturnsAsync(0);

            _chapterRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.That(result.Id, Is.Not.EqualTo(Guid.Empty));
            _chapterRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
        {
            // Arrange
            var command = CreateChapterTestData.GetValidCreateChapterCommand();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public async Task Handler_ShouldAssignCorrectOrderIndex_WhenChaptersExist()
        {
            // Arrange
            var command = CreateChapterTestData.GetValidCreateChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.CountByCourseAsync(It.IsAny<Guid>()))
                .ReturnsAsync(5);

            _chapterRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            _chapterRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Chapter>(c => c.OrderIndex == 6)), Times.Once);
            Assert.NotNull(result);
            Assert.That(result.Id, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void Handler_ShouldThrowException_WhenRepositoryFailsToAddChapter()
        {
            // Arrange
            var command = CreateChapterTestData.GetValidCreateChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.CountByCourseAsync(It.IsAny<Guid>()))
                .ReturnsAsync(0);

            _chapterRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Chapter>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo("Database error"));
        }

        [Test]
        public async Task Handler_ShouldCreateMultipleChapters_WithSequentialOrderIndices()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course { Id = CourseId.Of(courseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdAsync(courseId))
                .ReturnsAsync(course);

            var currentCount = 3;
            _chapterRepositoryMock
                .Setup(repo => repo.CountByCourseAsync(courseId))
                .ReturnsAsync(currentCount);

            _chapterRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<Chapter>()))
                .Callback<Chapter>(c => c.OrderIndex = ++currentCount)
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            var commands = new[]
            {
                new CreateChapterCommand
                {
                    CourseId = courseId,
                    CreateChapterDto = new CreateChapterDto(
                        Title: "Chapter 4",
                        Description: "Description 4",
                        IsActive: true
                    )
                },
                new CreateChapterCommand
                {
                    CourseId = courseId,
                    CreateChapterDto = new CreateChapterDto(
                        Title: "Chapter 5",
                        Description: "Description 5",
                        IsActive: true
                    )
                }
            };

            // Act
            foreach (var cmd in commands)
            {
                await _handler.Handle(cmd, CancellationToken.None);
            }

            // Assert
            _chapterRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Chapter>(c => c.OrderIndex == 4)), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Chapter>(c => c.OrderIndex == 5)), Times.Once);
        }
    }
}
