using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyEnrollmentsPerCourse;
public record GetMonthlyEnrollmentsPerCourseQuery(DateTime StartTime, DateTime EndTime, int CoursePerMonth) : IQuery<GetMonthlyEnrollmentsPerCourseResult>;
public record GetMonthlyEnrollmentsPerCourseResult(List<MonthlyCourseEnrollmentDto> MonthlyCourseEnrollments);

