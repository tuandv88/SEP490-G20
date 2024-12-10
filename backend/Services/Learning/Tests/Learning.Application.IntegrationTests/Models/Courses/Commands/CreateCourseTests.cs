namespace Learning.Application.IntegrationTests.Models.Courses.Commands;
using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Application.Models.Courses.Dtos;
public class CreateCourseTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireMinimumFields() {
        await RunAsAdministratorAsync();
        var command = new CreateCourseCommand(new CreateCourseDto(
            Title: "",
            Description: "",
            Headline: "",
            Prerequisites: "",
            Objectives: "",
            TargetAudiences: "",
            Image: new ImageDto(
                FileName: "",
                Base64Image: "",
                ContentType: ""
            ),
            CourseLevel: "",
            Price: -1
        ));

        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldCreateCourse() {
        // Arrange
        var user = await RunAsAdministratorAsync();

        var createCourseDto = new CreateCourseDto(
            Title: "Test Course",
            Description: "This is a test course description.",
            Headline: "Test Course Headline",
            Prerequisites: "Basic programming knowledge",
            Objectives:"Learn the basics of integration testing",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test-image.png",
                Base64Image: ImageUtils.CreateWhiteImageBase64(),
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 49.99
        );

        var command = new CreateCourseCommand(createCourseDto);

        // Act
        var result = await SendAsync(command);

        var course = await FindAsync<Course>(CourseId.Of(result.Id));

        // Assert
        course.Should().NotBeNull();
        course!.Title.Should().Be(createCourseDto.Title);
        course.Description.Should().Be(createCourseDto.Description);
        course.Headline.Should().Be(createCourseDto.Headline);
        course.Prerequisites.Should().BeEquivalentTo(createCourseDto.Prerequisites);
        course.Objectives.Should().BeEquivalentTo(createCourseDto.Objectives);
        course.TargetAudiences.Should().BeEquivalentTo(createCourseDto.TargetAudiences);
        course.ImageUrl.Should().NotBeNullOrEmpty();
        var expectedCourseLevel = Enum.Parse<CourseLevel>(createCourseDto.CourseLevel);
        course.CourseLevel.Should().Be(expectedCourseLevel);
        course.Price.Should().Be(createCourseDto.Price);
        course.CreatedBy.Should().Be(user.UserName);
    }
}
