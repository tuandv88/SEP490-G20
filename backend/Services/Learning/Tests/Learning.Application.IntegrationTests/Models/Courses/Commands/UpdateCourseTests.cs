using BuildingBlocks.Exceptions;
using Learning.Application.Models.Courses.Commands.UpdateCourse;
using Learning.Application.Models.Courses.Dtos;
namespace Learning.Application.IntegrationTests.Models.Courses.Commands;
public class UpdateCourseTests {
    [Test]
    public async Task ShouldRequireMinimumFieldsForUpdate() {
        await RunAsAdministratorAsync();
        var command = new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "",
                Description: "",
                Headline: "",
                Prerequisites: "",
                Objectives: "",
                TargetAudiences: "",
                Price: -1
            )
        );

        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<ValidationException>();
    }
    [Test]
    public async Task ShouldThrowNotFoundExceptionIfCourseDoesNotExist() {
        await RunAsAdministratorAsync();
        var command = new UpdateCourseCommand(
            CourseId: Guid.NewGuid(),
            UpdateCourseDto: new UpdateCourseDto(
                Title: "Updated Title",
                Description: "Updated Description",
                Headline: "Updated Headline",
                Prerequisites: "Updated Prerequisites",
                Objectives: "Updated Objectives",
                TargetAudiences: "Updated Target Audiences",
                Price: 99.99
            )
        );

        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>();
    }
    [Test]
    public async Task ShouldUpdateCourseSuccessfully() {
        // Arrange
        var user = await RunAsAdministratorAsync();

        var course = await FirstAsync<Course>();
        if(course==null) {
            return;
        }
        var courseId = course.Id.Value;
        var updateCourseDto = new UpdateCourseDto(
            Title: "Updated Test Course",
            Description: "This is an updated test course description.",
            Headline: "Updated Test Course Headline",
            Prerequisites: "Intermediate programming knowledge",
            Objectives: "Learn advanced testing techniques",
            TargetAudiences: "Developers",
            Price: 79.99
        );

        var command = new UpdateCourseCommand(courseId, updateCourseDto);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.IsSuccess.Should().BeTrue();

        var updatedCourse = await FindAsync<Course>(CourseId.Of(courseId));
        updatedCourse.Should().NotBeNull();
        updatedCourse!.Title.Should().Be(updateCourseDto.Title);
        updatedCourse.Description.Should().Be(updateCourseDto.Description);
        updatedCourse.Headline.Should().Be(updateCourseDto.Headline);
        updatedCourse.Prerequisites.Should().Be(updateCourseDto.Prerequisites);
        updatedCourse.Objectives.Should().Be(updateCourseDto.Objectives);
        updatedCourse.TargetAudiences.Should().Be(updateCourseDto.TargetAudiences);
        updatedCourse.Price.Should().Be(updateCourseDto.Price);
        updatedCourse.LastModifiedBy.Should().Be(user.UserName);
    }

}

