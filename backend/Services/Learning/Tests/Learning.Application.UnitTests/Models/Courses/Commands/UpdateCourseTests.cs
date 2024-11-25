using Learning.Application.Models.Courses.Commands.UpdateCourse;
using Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Commands;

[TestFixture]
public class UpdateCourseTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private UpdateCourseHandler _handler;
    private UpdateCourseCommandValidator _validator;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();

        _handler = new UpdateCourseHandler(_repositoryMock.Object);
        _validator = new UpdateCourseCommandValidator();
    }

    // Validator Tests
    [Test]
    public void Validator_ShouldPass_WhenAllFieldsAreValid()
    {
        var command = UpdateCourseTestData.GetValidUpdateCourseCommand();
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void Validator_ShouldFail_WhenTitleIsNull()
    {
        var command = UpdateCourseTestData.GetInvalidUpdateCourseCommand_NullTitle();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UpdateCourseDto.Title)
              .WithErrorMessage("Title must not be null.");
    }

    [Test]
    public void Validator_ShouldFail_WhenDescriptionIsEmpty()
    {
        var command = UpdateCourseTestData.GetInvalidUpdateCourseCommand_EmptyDescription();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UpdateCourseDto.Description)
              .WithErrorMessage("Description must not be empty.");
    }

    [Test]
    public void Validator_ShouldFail_WhenPriceIsNegative()
    {
        var command = UpdateCourseTestData.GetInvalidUpdateCourseCommand_NegativePrice();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UpdateCourseDto.Price)
              .WithErrorMessage("Price must be greater than or equal zero.");
    }

    [Test]
    public void Validator_ShouldFail_WhenTimeEstimationIsZero()
    {
        var command = UpdateCourseTestData.GetInvalidUpdateCourseCommand_ZeroTimeEstimation();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UpdateCourseDto.TimeEstimation)
              .WithErrorMessage("TimeEstimation must be greater than zero.");
    }

    // Handler Tests
    [Test]
    public async Task Handler_ShouldUpdateCourse_WhenValidRequest()
    {
        // Arrange
        var command = UpdateCourseTestData.GetValidUpdateCourseCommand();

        var mockCourse = new Learning.Domain.Models.Course(); // Replace with actual course initialization
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync(mockCourse);

        _repositoryMock
            .Setup(repo => repo.UpdateAsync(mockCourse))
            .Returns(Task.CompletedTask);

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1); // Return a successful SaveChanges

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsTrue(result.IsSuccess);
        _repositoryMock.Verify(repo => repo.UpdateAsync(mockCourse), Times.Once);
        _repositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
    {
        var command = UpdateCourseTestData.GetValidUpdateCourseCommand();

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync((Learning.Domain.Models.Course)null);

        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("Course"));
    }

    [Test]
    public void Handler_ShouldThrowException_WhenRepositoryUpdateFails()
    {
        var command = UpdateCourseTestData.GetValidUpdateCourseCommand();

        var mockCourse = new Learning.Domain.Models.Course(); // Replace with actual course initialization
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync(mockCourse);

        _repositoryMock
            .Setup(repo => repo.UpdateAsync(mockCourse))
            .ThrowsAsync(new Exception("Repository update failed"));

        var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("Repository update failed"));
    }
}
