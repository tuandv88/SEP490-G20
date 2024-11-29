
using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetLeaderboard;
public class GetLeaderboardHandler(IProblemRepository problemRepository, IProblemSubmissionRepository problemSubmissionRepository) : IQueryHandler<GetLeaderboardQuery, GetLeaderboardResult> {
    public async Task<GetLeaderboardResult> Handle(GetLeaderboardQuery request, CancellationToken cancellationToken) {

        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var problems = problemRepository.GetAllAsQueryable();
        var problemSubmissions = problemSubmissionRepository.GetAllAsQueryAble();

        var problemSubmissionsData = problemSubmissions
            .AsEnumerable() 
            .Where(ps => ps.Status.Description == SubmissionConstant.Accepted) 
            .ToList(); 

        var leaderboardQuery = problemSubmissionsData
            .Join(problems.AsEnumerable(), 
                ps => ps.ProblemId,
                p => p.Id,
                (ps, p) => new { ps, p.ProblemType })
            .Where(x => x.ProblemType == ProblemType.Challenge)
            .GroupBy(x => x.ps.UserId) 
            .Select(g => new {
                UserId = g.Key,
                SolvedCount = g.Count(),
                FirstSubmissionDate = g.Min(x => x.ps.SubmissionDate)
            });

        var totalCount = leaderboardQuery.Count();
        var paginatedData = leaderboardQuery
            .OrderByDescending(x => x.SolvedCount)
            .ThenBy(x => x.FirstSubmissionDate) 
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var leaderboard = paginatedData
            .Select(x => new UserRankDto(
                UserId: x.UserId.Value,
                SolvedCount: x.SolvedCount
            ))
            .ToList();

        return new GetLeaderboardResult(new PaginatedResult<UserRankDto>(pageIndex, pageSize, totalCount, leaderboard));
    }
}
