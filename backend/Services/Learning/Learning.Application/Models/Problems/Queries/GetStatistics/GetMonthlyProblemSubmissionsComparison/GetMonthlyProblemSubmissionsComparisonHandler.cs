namespace Learning.Application.Models.Problems.Queries.GetStatistics.GetMonthlyProblemSubmissionsComparison;
public class GetMonthlyProblemSubmissionsComparisonHandler(IProblemSubmissionRepository problemSubmissionRepository) : IQueryHandler<GetMonthlyProblemSubmissionsComparisonQuery, GetMonthlyProblemSubmissionsComparisonResult>
{
    public async Task<GetMonthlyProblemSubmissionsComparisonResult> Handle(GetMonthlyProblemSubmissionsComparisonQuery request, CancellationToken cancellationToken)
    {
        var currentMonthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = currentMonthStart.AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);

        var problemSubmissions = problemSubmissionRepository.GetAllAsQueryAble();

        var previousMonthSubmissionsCount = await problemSubmissions
            .Where(ps => ps.SubmissionDate >= previousMonthStart && ps.SubmissionDate <= previousMonthEnd)
            .CountAsync(cancellationToken);

        var currentMonthSubmissionsCount = await problemSubmissions
            .Where(ps => ps.SubmissionDate >= currentMonthStart && ps.SubmissionDate <= DateTime.UtcNow)
            .CountAsync(cancellationToken);

        double percentageChange = 0;
        if (previousMonthSubmissionsCount > 0)
        {
            percentageChange = (double)(currentMonthSubmissionsCount - previousMonthSubmissionsCount) / previousMonthSubmissionsCount * 100;
        }
        else if (currentMonthSubmissionsCount > 0)
        {
            percentageChange = 100;
        }

        return new GetMonthlyProblemSubmissionsComparisonResult(
            CurrentMonthCount: currentMonthSubmissionsCount,
            PreviousMonthCount: previousMonthSubmissionsCount,
            PercentageChange: percentageChange
        );
    }
}

