using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetCourseProgress;
[Authorize]
public record GetCourseProgressQuery(Guid CourseId) : IQuery<GetCourseProgressResult>;
public record GetCourseProgressResult(List<CourseProgressDto> Progress);
