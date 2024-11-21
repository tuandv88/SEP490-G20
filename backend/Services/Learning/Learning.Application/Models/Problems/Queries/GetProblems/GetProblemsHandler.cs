using Learning.Application.Models.Problems.Dtos;

namespace Learning.Application.Models.Problems.Queries.GetProblems;
public class GetProblemsHandler(IProblemRepository problemRepository, IProblemSubmissionRepository problemSubmissionRepository
    , IUserContextService userContext) : IQueryHandler<GetProblemsQuery, GetProblemsResult> {
    public async Task<GetProblemsResult> Handle(GetProblemsQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        //problem phải được active đối với người dùng cơ bản
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        // lấy ra toàn bộ data của problem
        var allDataProblem = await problemRepository.GetAllAsQueryableAsync();

        // Lọc dữ liệu: Chỉ admin mới thấy được các problem chưa active
        var filteredProblems = isAdmin
            ? allDataProblem // Admin có quyền thấy tất cả
            : allDataProblem.Where(p => p.IsActive); // Người dùng cơ bản chỉ thấy những problem đã active

        //Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = filteredProblems.Count();
        var problems = filteredProblems
                            .Include(pb => pb.ProblemSubmissions)
                            .OrderBy(c => c.CreatedAt)
                            .Where(p => p.ProblemType == ProblemType.Challenge)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var problemListDtos = problems.Select(p => p.ToProblemListDto(userId)).ToList();
        return new GetProblemsResult(
             new PaginatedResult<ProblemListDto>(pageIndex, pageSize, totalCount, problemListDtos));
    }
}