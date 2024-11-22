using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;

[Authorize]
public record GetCourseDetailsQuery(Guid Id) : IQuery<GetCourseDetailsResult>;
public record GetCourseDetailsResult(CourseDetailsDto CourseDetailsDto);

