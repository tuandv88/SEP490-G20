namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMonthlyNewLearnersComparison;
public class GetMonthlyNewLearnersComparisonHandler(IUserEnrollmentRepository userEnrollmentRepository) : IQueryHandler<GetMonthlyNewLearnersComparisonQuery, GetMonthlyNewLearnersComparisonResult> {
    public async Task<GetMonthlyNewLearnersComparisonResult> Handle(GetMonthlyNewLearnersComparisonQuery request, CancellationToken cancellationToken) {
        var currentMonthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = currentMonthStart.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);

        var userEnrollments = userEnrollmentRepository.GetAllAsQueryable();

        var previousMonthLearners = await userEnrollments
            .Where(e => e.EnrollmentDate >= previousMonthStart && e.EnrollmentDate < currentMonthStart)
            .GroupBy(e => e.UserId) 
            .Select(g => g.First())
            .ToListAsync(cancellationToken);

        var currentMonthLearners = await userEnrollments
            .Where(e => e.EnrollmentDate >= currentMonthStart && e.EnrollmentDate <= DateTime.UtcNow)
            .GroupBy(e => e.UserId)
            .Select(g => g.First()) 
            .ToListAsync(cancellationToken);


        var previousMonthCount = previousMonthLearners.Count;
        var currentMonthCount = currentMonthLearners.Count;

        double percentageChange = 0;
        if (previousMonthCount > 0) {
            percentageChange = ((double)(currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        } else if (currentMonthCount > 0) {
            percentageChange = 100;
        }

        return new GetMonthlyNewLearnersComparisonResult(
            CurrentMonthCount: currentMonthCount,
            PreviousMonthCount: previousMonthCount,
            PercentageChange: percentageChange
        );
    }
}
