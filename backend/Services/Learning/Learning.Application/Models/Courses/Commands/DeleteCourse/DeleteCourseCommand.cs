using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.DeleteCourse;
[Authorize($"{PoliciesType.Administrator}")]
public record DeleteCourseCommand(Guid CourseId) : ICommand;

