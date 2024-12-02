using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyEnrollmentsPerCourse;
[Authorize($"{PoliciesType.Administrator}")]
public record GetMonthlyEnrollmentsPerCourseQuery(DateTime StartTime, DateTime EndTime, int CoursePerMonth) : IQuery<GetMonthlyEnrollmentsPerCourseResult>;
public record GetMonthlyEnrollmentsPerCourseResult(List<MonthlyCourseEnrollmentDto> MonthlyCourseEnrollments);

