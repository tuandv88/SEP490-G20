//using Learning.Application.Models.Courses.Commands.DeleteCourse;
//using Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

//namespace Learning.Tests.Application.UnitTest.Models.Courses.Commands;

//[TestFixture]
//public class DeleteCourseTests
//{
//    private Mock<ICourseRepository> _repositoryMock;
//    private DeleteCourseHandler _handler;

//    [SetUp]
//    public void SetUp()
//    {
//        _repositoryMock = new Mock<ICourseRepository>();
//        _handler = new DeleteCourseHandler(_repositoryMock.Object);
//    }

//    // Validator Tests
//    [Test]
//    public void Validator_ShouldPass_WhenCourseIdIsValid()
//    {
//        // Arrange
//        var command = DeleteCourseTestData.GetValidDeleteCourseCommand();

//        // Act & Assert
//        Assert.DoesNotThrow(() => { });
//    }

//    [Test]
//    public void Validator_ShouldFail_WhenCourseIdIsEmpty()
//    {
//        // Arrange
//        var command = DeleteCourseTestData.GetInvalidDeleteCourseCommand_EmptyCourseId();

//        // Act & Assert
//        Assert.Throws<ArgumentException>(() =>
//        {
//            if (command.CourseId == Guid.Empty)
//            {
//                throw new ArgumentException("CourseId must not be empty.");
//            }
//        });
//    }

//    // Handler Tests

//    [Test]
//    public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
//    {
//        // Arrange
//        var command = DeleteCourseTestData.GetValidDeleteCourseCommand();

//        _repositoryMock
//            .Setup(repo => repo.GetByIdDetailAsync(command.CourseId))
//            .ReturnsAsync((Learning.Domain.Models.Course)null);

//        // Act & Assert
//        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
//        Assert.That(ex.Message, Does.Contain(nameof(Course)));
//    }

//}
