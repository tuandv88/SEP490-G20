namespace Learning.Application.Models.Courses.Queries.GetCoursesWithParticipation;

using Learning.Application.Models.Courses.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class GetCoursesWithParticipationHandler(
    ICourseRepository repository,
    IFilesService filesService,
    IUserContextService userContext)
    : IQueryHandler<GetCoursesWithParticipationQuery, GetCoursesWithParticipationResult>
{
    public async Task<GetCoursesWithParticipationResult> Handle(GetCoursesWithParticipationQuery request,
        CancellationToken cancellationToken)
    {
        var userId = userContext.User.Id;
        var userRole = userContext.User.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        var filter = request.Filter;
        var coursesQuery = repository.GetAllAsQueryable().AsSplitQuery().AsNoTracking();

        // Search by title
        if (!string.IsNullOrEmpty(filter.SearchString))
        {
            coursesQuery = coursesQuery.Where(c => c.Title.Contains(filter.SearchString));
        }

        // Filter by CourseIds
        if (request.CourseIds != null && request.CourseIds.Any())
        {
            var courseIdList = request.CourseIds.Select(Guid.Parse).ToList();
            var courseIdArray = courseIdList.Select(c => CourseId.Of(c)).ToList();
            coursesQuery = coursesQuery.Where(c => courseIdArray.Contains(c.Id));
        }

        // Filter by status for non-admin users
        if (!isAdmin)
        {
            coursesQuery = coursesQuery.Where(c => c.CourseStatus == CourseStatus.Published);
        }

        // Apply pagination and ordering
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        // Tính tổng số bản ghi trước khi phân trang
        var totalCount = await coursesQuery.CountAsync(cancellationToken);

        // Truy vấn dữ liệu với phân trang và sắp xếp
        var courses = await coursesQuery
            .OrderByDescending(c => c.UserEnrollments
                .Where(ue => ue.UserId.Equals(UserId.Of(userId)))
                .Select(ue => ue.EnrollmentDate)
                .FirstOrDefault())
            .Skip(pageSize * (pageIndex - 1))
            .Take(pageSize)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Headline,
                c.ImageUrl,
                UserEnrollment = c.UserEnrollments
                    .Where(ue => ue.UserId.Equals(UserId.Of(userId)))
                    .Select(ue => new
                    {
                        ue.EnrollmentDate,
                        ue.CompletionDate,
                        ue.UserEnrollmentStatus,
                        LectureProgressCount = ue.LectureProgress.Count
                    })
                    .FirstOrDefault(),
                TotalLectures = c.Chapters.Sum(ch => ch.Lectures.Count),
                c.Price,
                c.TimeEstimation,
                c.CourseLevel
            })
            .ToListAsync(cancellationToken);

        // Sử dụng Task.WhenAll để lấy các URL S3 song song và tạo DTO
        var courseDtos = await Task.WhenAll(courses.Select(async course =>
        {
            var completionPercentage = course.TotalLectures > 0
                ? Math.Round((double)(course.UserEnrollment?.LectureProgressCount ?? 0) / course.TotalLectures * 100, 2)
                : 0;

            var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60 * 24);

            return new CourseWithParticipationDto(
                course.Id.Value,
                course.Title,
                course.Headline,
                s3Object.PresignedUrl!,
                course.UserEnrollment?.EnrollmentDate,
                course.UserEnrollment?.CompletionDate,
                course.UserEnrollment?.UserEnrollmentStatus.ToString() ?? "NotEnrolled",
                completionPercentage,
                course.Price,
                course.TimeEstimation,
                course.CourseLevel.ToString()
            );
        }));

        return new GetCoursesWithParticipationResult(
            new PaginatedResult<CourseWithParticipationDto>(pageIndex, pageSize, totalCount, courseDtos.ToList()));
    }
}