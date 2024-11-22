using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.CreateEnrollmentCourse;
[Authorize]
public record CreateEnrollmentCourseCommand(Guid CourseId) : ICommand<CreateEnrollmentCourseResult>;
public record CreateEnrollmentCourseResult(bool IsSuccess);
