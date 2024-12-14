using Learning.Application.Models.Courses.Dtos;
using Microsoft.IdentityModel.Tokens;

namespace Learning.Application.Models.Courses.Queries.GetCourses;
public class GetCoursesHandler(
    ICourseRepository repository,
    IFilesService filesService,
    IUserContextService userContext
) : IQueryHandler<GetCoursesQuery, GetCoursesResult>
{
    public async Task<GetCoursesResult> Handle(GetCoursesQuery query, CancellationToken cancellationToken)
    {
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;
        
        var filteredData = repository.GetAllAsQueryable();

        var titleSearch = query.Filter.SearchString ?? "";
        filteredData = filteredData.Where(c => c.Title.ToLower().Contains(titleSearch.ToLower()));
        if (!isAdmin)
        {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published || c.CourseStatus == CourseStatus.Scheduled);
        }

        if (!query.Filter.Level.IsNullOrEmpty() && 
            Enum.TryParse<CourseLevel>(query.Filter.Level, true, out var courseLevel))
        {
            filteredData = filteredData.Where(c => c.CourseLevel == courseLevel);
        }

        if (!query.Filter.Status.IsNullOrEmpty() &&
            Enum.TryParse<CourseStatus>(query.Filter.Status, true, out var courseStatus))
        {
            filteredData = filteredData.Where(c => c.CourseStatus == courseStatus);
        }

        // Tính tổng số course
        var totalCount = await filteredData.CountAsync(cancellationToken);

        // Truy vấn dữ liệu cần trả về, tính toán AverageRating và TotalParticipants trực tiếp
        var courses = await filteredData
            .OrderByDescending(c => c.CreatedAt)
            .Skip(pageSize * (pageIndex - 1))
            .Take(pageSize)
            .Select(c => new 
            {
                c.Id,
                c.Title,
                c.Headline,
                c.CourseStatus,
                c.ScheduledPublishDate,
                c.ImageUrl,
                c.OrderIndex,
                c.CourseLevel,
                c.Price,
                AverageRating = c.UserEnrollments.Any(e => e.Rating > 0)
                    ? Math.Round(c.UserEnrollments.Where(e => e.Rating > 0).Average(e => e.Rating), 1) // Trực tiếp tính trung bình
                    : 0,
                TotalParticipants = c.UserEnrollments.Count()
            })
            .ToListAsync(cancellationToken);
        
        var courseBasicDtos = courses.Select(c => new CourseBasicDto(
            c.Id.Value,
            c.Title,
            c.Headline,
            c.CourseStatus.ToString(),
            c.ScheduledPublishDate,
            null!, 
            c.OrderIndex,
            c.CourseLevel.ToString(),
            c.Price,
            c.AverageRating,
            c.TotalParticipants
        )).ToList();
        
        var imageTasks = courses.Select(async c =>
        {
            var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, c.ImageUrl, 60 * 24);
            return new { Id = c.Id.Value, PresignedUrl = imageUrl.PresignedUrl! };
        });

        var imageResults = await Task.WhenAll(imageTasks);
        
        courseBasicDtos = courseBasicDtos.Select(dto =>
        {
            var imageResult = imageResults.FirstOrDefault(img => img.Id == dto.Id);
            return dto with { ImageUrl = imageResult?.PresignedUrl! };
        }).ToList();
        
        return new GetCoursesResult(
            new PaginatedResult<CourseBasicDto>(pageIndex, pageSize, totalCount, courseBasicDtos)
        );
    }
}