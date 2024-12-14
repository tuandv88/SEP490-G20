using Learning.Application.Models.Courses.Dtos;
namespace Learning.Application.Models.Courses.Queries.GetMostPopularCourses;

public class GetMostPopularCoursesHandler(
    ICourseRepository repository,
    IFilesService filesService,
    IUserContextService userContext
) : IQueryHandler<GetMostPopularCoursesQuery, GetMostPopularCourseResult>
{
    public async Task<GetMostPopularCourseResult> Handle(GetMostPopularCoursesQuery request, CancellationToken cancellationToken)
    {
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;
        
        var filteredData = repository.GetAllAsQueryable();
        
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;
        
        if (!isAdmin)
        {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published);
        }
        
        var totalCount = await filteredData.CountAsync(cancellationToken);
        
        var courses = await filteredData
            .OrderByDescending(c => c.UserEnrollments.Count)
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
                TotalParticipants = c.UserEnrollments.Count(),
                AverageRating = c.UserEnrollments.Any(e => e.Rating > 0)
                    ? Math.Round(c.UserEnrollments.Where(e => e.Rating > 0).Average(e => e.Rating), 1)
                    : 0
            })
            .ToListAsync(cancellationToken);
        
        var imageTasks = courses.Select(async c =>
        {
            var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, c.ImageUrl, 60 * 24);
            return new { c.Id, PresignedUrl = imageUrl.PresignedUrl! };
        });

        var imageResults = await Task.WhenAll(imageTasks);
        
        var courseBasicDtos = courses.Select(c =>
        {
            var imageResult = imageResults.FirstOrDefault(img => img.Id == c.Id);
            return new CourseBasicDto(
                c.Id!.Value, 
                c.Title, 
                c.Headline, 
                c.CourseStatus.ToString(),
                c.ScheduledPublishDate,
                imageResult?.PresignedUrl!,
                c.OrderIndex,
                c.CourseLevel.ToString(),
                c.Price,
                c.AverageRating,
                c.TotalParticipants
            );
        }).ToList();

        // Trả kết quả
        return new GetMostPopularCourseResult(
            new PaginatedResult<CourseBasicDto>(pageIndex, pageSize, totalCount, courseBasicDtos)
        );
    }
}