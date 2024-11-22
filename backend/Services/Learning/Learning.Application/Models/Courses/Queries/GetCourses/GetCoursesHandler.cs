using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourses;

public class GetCoursesHandler(ICourseRepository repository, IFilesService filesService, IUserContextService userContext)
    : IQueryHandler<GetCoursesQuery, GetCoursesResult> {
    public async Task<GetCoursesResult> Handle(GetCoursesQuery query, CancellationToken cancellationToken) {

        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        var allData = await repository.GetAllAsync();
        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var filteredData = allData.AsQueryable();
        var titleSearch = query.Filter.SearchString ?? "";

        filteredData = filteredData.Where(c => c.Title.Contains(titleSearch, StringComparison.OrdinalIgnoreCase));

        if (!isAdmin) {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published);
        }

        var totalCount = filteredData.Count();
        var courses = filteredData.OrderByDescending(c => c.CreatedAt)
                                .Skip(pageSize * (pageIndex - 1))
                                .Take(pageSize)
                                .ToList();
        return new GetCoursesResult(
            new PaginatedResult<CourseDto>(pageIndex, pageSize, totalCount, await courses.ToCourseDtoListAsync(filesService)));
    }
}

