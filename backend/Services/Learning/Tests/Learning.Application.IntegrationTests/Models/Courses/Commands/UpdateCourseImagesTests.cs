using BuildingBlocks.Exceptions;
using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Application.Models.Courses.Commands.UpdateCourseImage;
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.IntegrationTests.Models.Courses.Commands;
public class UpdateCourseImagesTests {
    [Test]
    public async Task ShouldRequireValidCourseId() {
        await RunAsAdministratorAsync();
        // Arrange
        var command = new UpdateCourseImageCommand(
            CourseId: Guid.NewGuid(),
            ImageDto: new ImageDto(
                FileName: "test-image.png",
                Base64Image: ImageUtils.CreateWhiteImageBase64(),
                ContentType: "image/png"
            )
        );

        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>();
    }
    [Test]
    public async Task ShouldUpdateCourseImage() {
        // Arrange
        var user = await RunAsAdministratorAsync();
        var existingCourse = await CreateTestCourseAsync(); // Assume a helper method to create a test course

        var newImage = new ImageDto(
            FileName: "new-image.png",
            Base64Image: ImageUtils.CreateWhiteImageBase64(),
            ContentType: "image/png"
        );

        var command = new UpdateCourseImageCommand(existingCourse!.Id.Value, newImage);

        // Act
        var result = await SendAsync(command);

        // Assert
        var updatedCourse = await FindAsync<Course>(existingCourse.Id);

        updatedCourse.Should().NotBeNull();
        updatedCourse!.ImageUrl.Should().NotBeNullOrEmpty();
        updatedCourse.ImageUrl.Should().NotBe(existingCourse.ImageUrl);
        result.PresignedUrl.Should().NotBeNullOrEmpty();
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

