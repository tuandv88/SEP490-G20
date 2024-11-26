using Learning.Application.Models.Chapters.Commands.DeleteChapter;
using Learning.Application.UnitTests.Models.Chapters.Helpers;

namespace Learning.Application.UnitTests.Models.Chapters.Commands
{
    [TestFixture]
    public class DeleteChapterHandlerTests
    {
        private Mock<ICourseRepository> _courseRepositoryMock;
        private Mock<IChapterRepository> _chapterRepositoryMock;
        private Mock<IProblemRepository> _problemRepositoryMock;
        private Mock<IQuizRepository> _quizRepositoryMock;
        private Mock<ILectureRepository> _lectureRepositoryMock;
        private DeleteChapterHandler _handler;

        [SetUp]
        public void SetUp()
        {
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _chapterRepositoryMock = new Mock<IChapterRepository>();
            _problemRepositoryMock = new Mock<IProblemRepository>();
            _quizRepositoryMock = new Mock<IQuizRepository>();
            _lectureRepositoryMock = new Mock<ILectureRepository>();
            _handler = new DeleteChapterHandler(
                _courseRepositoryMock.Object,
                _chapterRepositoryMock.Object,
                _problemRepositoryMock.Object,
                _quizRepositoryMock.Object,
                _lectureRepositoryMock.Object);
        }

        [Test]
        public async Task Handler_ShouldDeleteChapter_WhenValidRequest()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            var chapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Lectures = new List<Lecture>
                {
                    new Lecture { ProblemId = ProblemId.Of(Guid.NewGuid()), QuizId = QuizId.Of(Guid.NewGuid()) },
                    new Lecture { ProblemId = null, QuizId = QuizId.Of(Guid.NewGuid()) }
                }
            };

            course.Chapters.Add(chapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _problemRepositoryMock
                .Setup(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()))
                .Returns(Task.CompletedTask);

            _quizRepositoryMock
                .Setup(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()))
                .Returns(Task.CompletedTask);

            _lectureRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            _lectureRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()), Times.Once);
            _problemRepositoryMock.Verify(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()), Times.Exactly(1));
            _quizRepositoryMock.Verify(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()), Times.Exactly(2));
            _chapterRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
        {
            // Arrange
            var command = DeleteChapterTestData.GetInvalidDeleteChapterCommand_InvalidCourse();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenChapterDoesNotExist()
        {
            // Arrange
            var command = DeleteChapterTestData.GetInvalidDeleteChapterCommand_InvalidChapter();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo("Chapter not found"));
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseIsNull()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenChapterIsNull()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Is.EqualTo("Chapter not found"));
        }


        [Test]
        public async Task Handler_ShouldHandle_WhenNoLecturesExistInChapter()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };
            var chapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Lectures = new List<Lecture>() // Không có bài giảng nào trong chapter
            };

            course.Chapters.Add(chapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _chapterRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            _chapterRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_ShouldDeleteAssociatedProblemsAndQuizzes_WhenChapterHasLectures()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            var lecture1 = new Lecture
            {
                ProblemId = ProblemId.Of(Guid.NewGuid()),
                QuizId = QuizId.Of(Guid.NewGuid())
            };
            var lecture2 = new Lecture
            {
                ProblemId = ProblemId.Of(Guid.NewGuid()),
                QuizId = null
            };

            var chapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Lectures = new List<Lecture> { lecture1, lecture2 }
            };

            course.Chapters.Add(chapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _problemRepositoryMock
                .Setup(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()))
                .Returns(Task.CompletedTask);

            _quizRepositoryMock
                .Setup(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()))
                .Returns(Task.CompletedTask);

            _lectureRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            _problemRepositoryMock.Verify(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()), Times.Exactly(2));
            _quizRepositoryMock.Verify(repo => repo.DeleteByIdAsync(It.IsAny<Guid>()), Times.Exactly(1));
            _lectureRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public void Handler_ShouldThrowNotFoundException_WhenCourseAndChapterAreNull()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync((Course)null);

            // Act & Assert
            var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
            Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
        }

        [Test]
        public async Task Handler_ShouldHandle_WhenChapterHasNoQuizzesOrProblems()
        {
            // Arrange
            var command = DeleteChapterTestData.GetValidDeleteChapterCommand();
            var course = new Course { Id = CourseId.Of(command.CourseId) };

            var chapter = new Chapter
            {
                Id = ChapterId.Of(command.ChapterId),
                Lectures = new List<Lecture>
        {
            new Lecture { ProblemId = null, QuizId = null }
        }
            };

            course.Chapters.Add(chapter);

            _courseRepositoryMock
                .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
                .ReturnsAsync(course);

            _lectureRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.DeleteAsync(It.IsAny<Chapter>()))
                .Returns(Task.CompletedTask);

            _chapterRepositoryMock
                .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0));

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            _lectureRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Lecture[]>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.DeleteAsync(It.IsAny<Chapter>()), Times.Once);
            _chapterRepositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

    }
}
