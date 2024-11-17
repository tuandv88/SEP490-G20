using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourses;

public class GetCoursesHandler(ICourseRepository repository, IFilesService filesService)
    : IQueryHandler<GetCoursesQuery, GetCoursesResult>
{
    public async Task<GetCoursesResult> Handle(GetCoursesQuery query, CancellationToken cancellationToken)
    {
        var allData = await repository.GetAllAsync();
        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();
        var courses = allData.OrderBy(c => c.CreatedAt)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();
        return new GetCoursesResult(
            new PaginatedResult<CourseDto>(pageIndex, pageSize, totalCount,await courses.ToCourseDtoListAsync(filesService)));
    }
}

