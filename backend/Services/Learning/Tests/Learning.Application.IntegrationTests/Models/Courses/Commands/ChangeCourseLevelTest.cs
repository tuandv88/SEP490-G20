namespace Learning.Application.IntegrationTests.Models.Courses.Commands;

using Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
using FluentAssertions;
using System.Threading.Tasks;
using NUnit.Framework;
using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Application.Models.Courses.Dtos;

public class ChangeCourseLevelTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireValidCourseLevel() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var existingCourse = await CreateTestCourseAsync();

        var command = new ChangeCourseLevelCommand(existingCourse!.Id.Value, "InvalidLevel");

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldChangeCourseLevel() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var existingCourse = await CreateTestCourseAsync(); 

        var newCourseLevel = "Intermediate"; 
        var command = new ChangeCourseLevelCommand(existingCourse!.Id.Value, newCourseLevel);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Message.Should().Be("Course level and order index updated successfully.");

        var updatedCourse = await FindAsync<Course>(existingCourse.Id);
        updatedCourse!.CourseLevel.ToString().Should().Be(newCourseLevel);

        updatedCourse.OrderIndex.Should().BeGreaterThan(0);
    }

    [Test]
    public async Task ShouldNotChangeIfCourseLevelIsSame() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var existingCourse = await CreateTestCourseAsync(); // Assume a helper method to create a test course

        var currentCourseLevel = existingCourse!.CourseLevel.ToString();
        var command = new ChangeCourseLevelCommand(existingCourse.Id.Value, currentCourseLevel);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Message.Should().Be("Course level is already set to the specified value.");
    }

    private async Task<Course?> CreateTestCourseAsync() {
        // Helper method to create a test course for testing purposes
        var createCourseDto = new CreateCourseDto(
            Title: "Test Course",
            Description: "This is a test course description.",
            Headline: "Test Course Headline",
            Prerequisites: "Basic programming knowledge",
            Objectives: "Learn the basics of integration testing",
            TargetAudiences: "Developers",
            Image: new ImageDto(
                FileName: "test-image.png",
                Base64Image: ImageUtils.CreateWhiteImageBase64(),
                ContentType: "image/png"
            ),
            CourseLevel: "Basic",
            Price: 49.99
        );

        var createCourseCommand = new CreateCourseCommand(createCourseDto);
        var result = await SendAsync(createCourseCommand);
        return await FindAsync<Course>(CourseId.Of(result.Id));
    }
}
