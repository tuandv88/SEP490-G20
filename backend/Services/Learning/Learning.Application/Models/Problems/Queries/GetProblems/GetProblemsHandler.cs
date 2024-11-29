using Amazon.S3.Model;
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
        var allDataProblem = problemRepository.GetAllAsQueryable();

        var filter = request.Filter;
        var titleSearch = filter.SearchString ?? "";

        // Lọc dữ liệu: Chỉ admin mới thấy được các problem chưa active
        var filteredProblems = allDataProblem.Where(p =>
                (isAdmin || (p.IsActive && p.ProblemType == ProblemType.Challenge)) &&
                p.Title.ToLower().Contains(titleSearch.ToLower())); 

        //Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = filteredProblems.Count();
        var problems = filteredProblems
                            .Include(pb => pb.ProblemSubmissions)
                            .OrderBy(c => c.CreatedAt)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var problemListDtos = problems.Select(p => p.ToProblemListDto(userId));
        return new GetProblemsResult(
             new PaginatedResult<ProblemListDto>(pageIndex, pageSize, totalCount, problemListDtos.ToList()));
    }
}