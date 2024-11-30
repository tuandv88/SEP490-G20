using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyEnrollmentsPerCourse;
public class GetMonthlyEnrollmentsPerCourseHandler(ICourseRepository courseRepository, IUserEnrollmentRepository userEnrollmentRepository) : IQueryHandler<GetMonthlyEnrollmentsPerCourseQuery, GetMonthlyEnrollmentsPerCourseResult> {
    public async Task<GetMonthlyEnrollmentsPerCourseResult> Handle(GetMonthlyEnrollmentsPerCourseQuery request, CancellationToken cancellationToken) {

        DateTime startTime = request.StartTime;
        DateTime endTime = request.EndTime;

        var userEnrollmentsQuery = userEnrollmentRepository
            .GetAllAsQueryable()
            .Where(ue => ue.EnrollmentDate >= startTime && ue.EnrollmentDate <= endTime);

        var paginatedEnrollments = await userEnrollmentsQuery
            .GroupBy(ue => new { ue.CourseId, ue.EnrollmentDate.Year, ue.EnrollmentDate.Month })
            .Select(g => new {
                g.Key.CourseId,
                g.Key.Year,
                g.Key.Month,
                EnrollmentCount = g.Count()
            })
            .OrderBy(e => e.Year)
            .ThenBy(e => e.Month)
            .ToListAsync(cancellationToken);

        var totalMonths = paginatedEnrollments.Select(e => new { e.Year, e.Month }).Distinct().Count();

        var courseIds = paginatedEnrollments.Select(e => e.CourseId).Distinct().ToList();

        var courses = await courseRepository
            .GetAllAsQueryable()
            .Where(c => courseIds.Contains(c.Id))
            .ToListAsync(cancellationToken);
        int coursePerMonth = request.CoursePerMonth;
        var result = new GetMonthlyEnrollmentsPerCourseResult(
            MonthlyCourseEnrollments: paginatedEnrollments
                .GroupBy(monthEnrollment => new { monthEnrollment.Year, monthEnrollment.Month })
                .Select(monthGroup => new MonthlyCourseEnrollmentDto(
                    Year: monthGroup.Key.Year,
                    Month: monthGroup.Key.Month,
                    Courses: monthGroup
                        .OrderByDescending(e => e.EnrollmentCount)
                        .Take(coursePerMonth)
                        .Select(monthEnrollment => new CourseEnrollmentDto(
                            CourseId: monthEnrollment.CourseId.Value,
                            Title: courses.FirstOrDefault(c => c.Id == monthEnrollment.CourseId)?.Title,
                            EnrollmentCount: monthEnrollment.EnrollmentCount
                        ))
                        .ToList()
                ))
                .ToList()
        );

        return result;


    }
}

