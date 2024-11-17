using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblems;
public class GetProblemsHandler(IProblemRepository problemRepository, IProblemSubmissionRepository problemSubmissionRepository
    , IUserContextService userContext) : IQueryHandler<GetProblemsQuery, GetProblemsResult> {
    public async Task<GetProblemsResult> Handle(GetProblemsQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        // lấy ra toàn bộ data của problem
        var allDataProblem = await problemRepository.GetAllAsync();
        //Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = allDataProblem.Count();
        var problems = allDataProblem.OrderBy(c => c.CreatedAt)
                            .Where(p => p.ProblemType == ProblemType.Challenge)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var listProlemId = problems.Select(p => p.Id.Value).ToArray();

        //Lấy ra các problem solution của problem
        var problemSubmissions = await problemSubmissionRepository.GetProblemSubmissionsByProblemAsync(listProlemId);

        //map problemSolution vào Problem
        problems.ForEach(p => {
            var listSubmission = problemSubmissions.Where(pl => pl.ProblemId.Value.Equals(p.Id.Value)).ToList();
            p.ProblemSubmissions = listSubmission;
        });

        var problemListDtos = problems.Select(p => p.ToProblemListDto(userId)).ToList();
        return new GetProblemsResult(
             new PaginatedResult<ProblemListDto>(pageIndex, pageSize, totalCount, problemListDtos));
    }
}

