using BuildingBlocks.Exceptions;
using Learning.Application.Models.Courses.Commands.DeleteCourse;
using MediatR;

namespace Learning.Application.IntegrationTests.Models.Courses.Commands;
public class DeleteCourseTests {
    [Test]
    public async Task ShouldThrowNotFoundExceptionIfCourseDoesNotExist() {
        await RunAsAdministratorAsync();
        // Arrange
        var nonExistentCourseId = Guid.NewGuid(); 

        var command = new DeleteCourseCommand(nonExistentCourseId);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>();
    }
    [Test]
    public async Task ShouldDeleteCourseSuccessfully() {
        await RunAsAdministratorAsync();
        // Arrange
        var course = await FirstAsync<Course>();
        if(course == null) {
            return;
        }
        var courseId = course.Id.Value;
        var command = new DeleteCourseCommand(courseId);

        // Act
        var result = await SendAsync(command);

        // Assert
        result.Should().Be(Unit.Value);

        var courseDelete = await FindAsync<Course>(CourseId.Of(courseId));
        courseDelete.Should().BeNull();
    }
    [Test]
    public async Task ShouldThrowUnauthorizedExceptionIfUserIsNotAdministrator() {
        var user = await RunAsDefaultUserAsync(); 
        var course = await FirstAsync<Course>();
        if (course == null) {
            return;
        }
        var courseId = course.Id.Value;

        var command = new DeleteCourseCommand(courseId);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("User does not meet policy requirements.");
    }
}

