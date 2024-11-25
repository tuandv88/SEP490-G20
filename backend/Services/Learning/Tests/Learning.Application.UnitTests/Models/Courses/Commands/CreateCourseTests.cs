using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Tests.Application.UnitTest.Models.Courses.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Courses.Commands;

[TestFixture]
public class CreateCourseTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private Mock<IFilesService> _filesServiceMock;
    private Mock<IBase64Converter> _base64ConverterMock;
    private CreateCourseHandler _handler;
    private CreateCourseCommandValidator _validator;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();
        _filesServiceMock = new Mock<IFilesService>();
        _base64ConverterMock = new Mock<IBase64Converter>();

        _handler = new CreateCourseHandler(
            _repositoryMock.Object,
            _filesServiceMock.Object,
            _base64ConverterMock.Object
        );

        _validator = new CreateCourseCommandValidator();
    }

    // Validator Tests
    [Test]
    public void Validator_ShouldPass_WhenAllFieldsAreValid()
    {
        var command = CreateCourseTestData.GetValidCreateCourseCommand();
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void Validator_ShouldFail_WhenTitleIsNull()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_NullTitle();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CreateCourseDto.Title)
              .WithErrorMessage("Title must not be null.");
    }

    [Test]
    public void Validator_ShouldFail_WhenDescriptionIsEmpty()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_EmptyDescription();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CreateCourseDto.Description)
              .WithErrorMessage("Description must not be empty.");
    }

    [Test]
    public void Validator_ShouldFail_WhenPriceIsNegative()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_NegativePrice();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CreateCourseDto.Price)
              .WithErrorMessage("Price must be greater than or equal zero.");
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseLevelIsInvalid()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_InvalidCourseLevel();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CreateCourseDto.CourseLevel)
              .WithErrorMessage("CourseLevel must be a valid value (Basic, Intermediate, Advanced, Expert).");
    }

    [Test]
    public void Validator_ShouldFail_WhenTimeEstimationIsZero()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_ZeroTimeEstimation();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CreateCourseDto.TimeEstimation)
              .WithErrorMessage("TimeEstimation must be greater than zero.");
    }

    // Handler Tests
    [Test]
    public async Task Handler_ShouldCreateCourse_WhenValidRequest()
    {
        var command = CreateCourseTestData.GetValidCreateCourseCommand();

        _filesServiceMock
            .Setup(x => x.UploadFileAsync(It.IsAny<MemoryStream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("uploaded/test.png");

        _repositoryMock
            .Setup(repo => repo.CountByLevelAsync(It.IsAny<CourseLevel>()))
            .ReturnsAsync(0);

        _repositoryMock
            .Setup(repo => repo.AddAsync(It.IsAny<Learning.Domain.Models.Course>()))
            .Returns(Task.CompletedTask);

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.That(result.Id, Is.Not.EqualTo(Guid.Empty));
    }

    [Test]
    public void Handler_ShouldThrowException_WhenFileServiceFails()
    {
        var command = CreateCourseTestData.GetValidCreateCourseCommand();

        _filesServiceMock
            .Setup(x => x.UploadFileAsync(It.IsAny<MemoryStream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("File upload failed"));

        var ex = Assert.ThrowsAsync<Exception>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("File upload failed"));
    }

    [Test]
    public void Handler_ShouldThrowException_WhenCourseLevelIsInvalid()
    {
        var command = CreateCourseTestData.GetInvalidCreateCourseCommand_InvalidCourseLevel();

        var ex = Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("Value 'InvalidLevel' is not valid for CourseLevel."));
    }
}
