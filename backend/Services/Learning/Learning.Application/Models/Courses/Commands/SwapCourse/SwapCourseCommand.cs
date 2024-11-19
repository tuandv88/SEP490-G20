using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.SwapCourse;
[Authorize(Roles = $"{RoleType.Administrator}")]
public record SwapCourseCommand(Guid CourseId1, Guid CourseId2) : ICommand<SwapCourseResult>;
public record SwapCourseResult(int OrderIndexCourse1, int OrderIndexCourse2);

