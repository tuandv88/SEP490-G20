using Learning.Application.Data.Repositories;
using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetStatistics.GetTopSolvedProblems;
public class GetTopSolvedProblemsHandler(IProblemRepository problemRepository) : IQueryHandler<GetTopSolvedProblemsQuery, GetTopSolvedProblemsResult>
{
    public async Task<GetTopSolvedProblemsResult> Handle(GetTopSolvedProblemsQuery request, CancellationToken cancellationToken)
    {
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var problemsQuery = problemRepository.GetAllAsQueryable()
            .Include(p => p.ProblemSubmissions)
            .ToList();

        var problemSubmissionsQuery = problemsQuery
            .Select(p => new {
                ProblemId = p.Id,
                p.Title,
                TotalSubmissions = p.ProblemSubmissions.Count(),
                AcceptedSubmissions = p.ProblemSubmissions.Count(ps => ps.Status.Description == SubmissionConstant.Accepted)
            });

        var topSolvedProblems = problemSubmissionsQuery
            .OrderByDescending(p => p.TotalSubmissions)
            .ThenByDescending(p => p.TotalSubmissions > 0
                ? (float)p.AcceptedSubmissions / p.TotalSubmissions * 100
                : 0)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var topSolvedProblemsDtos = topSolvedProblems.Select(p => new TopSolvedProblemDto(
            ProblemId: p.ProblemId.Value,
            Title: p.Title,
            TotalSubmissions: p.TotalSubmissions,
            AcceptedSubmissions: p.AcceptedSubmissions,
            AcceptanceRate: p.TotalSubmissions > 0
                ? (float)p.AcceptedSubmissions / p.TotalSubmissions * 100
                : 0 
        )).ToList();

        var totalCount = problemSubmissionsQuery.Count();

        return new GetTopSolvedProblemsResult(
            new PaginatedResult<TopSolvedProblemDto>(pageIndex, pageSize, totalCount, topSolvedProblemsDtos)
        );
    }
}

