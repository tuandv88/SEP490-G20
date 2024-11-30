using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMostPopularCourseWithEnrollments;
[Authorize($"{PoliciesType.Administrator}")]
public record GetMostPopularCourseWithEnrollmentsQuery(PaginationRequest PaginationRequest) : IQuery<GetMostPopularCourseWithEnrollmentsResult>;
public record GetMostPopularCourseWithEnrollmentsResult(PaginatedResult<CourseWithEnrollmentDto> Courses);

