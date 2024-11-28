
using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetMostPopularCourses;
public class GetMostPopularCoursesHandler(ICourseRepository repository, IFilesService filesService, IUserContextService userContext) : IQueryHandler<GetMostPopularCoursesQuery, GetMostPopularCourseResult> {
    public async Task<GetMostPopularCourseResult> Handle(GetMostPopularCoursesQuery request, CancellationToken cancellationToken) {

        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        var filteredData = repository.GetAllAsQueryable().Include(c => c.UserEnrollments).AsQueryable();
        //Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        if (!isAdmin) {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published);
        }

        var totalCount = filteredData.Count();
        var courses = filteredData.OrderByDescending(c => c.UserEnrollments.Count)
                                .Skip(pageSize * (pageIndex - 1))
                                .Take(pageSize)
                                .ToList();

        return new GetMostPopularCourseResult(
            new PaginatedResult<CourseDto>(pageIndex, pageSize, totalCount, await courses.ToCourseDtoListAsync(filesService)));
    }
}

