namespace Learning.Application.Models.Courses.Queries.GetUserEnrollmentCourses;

using Learning.Application.Models.Courses.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class GetUserEnrollmentCoursesHandler(
    ICourseRepository repository,
    IFilesService filesService,
    IUserContextService userContext)
    : IQueryHandler<GetUserEnrollmentCoursesQuery, GetUserEnrollmentCoursesResult>
{
    public async Task<GetUserEnrollmentCoursesResult> Handle(GetUserEnrollmentCoursesQuery request,
        CancellationToken cancellationToken)
    {
        var userId = userContext.User.Id;
        var userRole = userContext.User.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        // Lọc các khóa học mà user đã tham gia
        var filteredData = repository.GetAllAsQueryable()
            .AsNoTracking();

        // Nếu CourseIds không rỗng, thêm điều kiện lọc theo danh sách CourseIds
        if (request.CourseIds != null && request.CourseIds.Any())
        {
            var courseIdList = request.CourseIds.Select(Guid.Parse).ToList();
            var courseIdArray = courseIdList.Select(c => CourseId.Of(c)).ToList();
            filteredData = filteredData.Where(c => courseIdArray.Contains(c.Id));
        }

        // Chỉ lấy các khóa học mà người dùng đã tham gia
        filteredData = filteredData.Where(c => c.UserEnrollments.Any(ue => ue.UserId.Equals(UserId.Of(userId))));

        // Nếu người dùng không phải admin, chỉ lấy các khóa học published
        if (!isAdmin)
        {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published);
        }

        // Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = await filteredData.CountAsync(cancellationToken);

        // Truy vấn dữ liệu với phân trang và sắp xếp
        var courses = await filteredData
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
                        ue.Rating,
                        ue.Feedback,
                        LectureProgressCount = ue.LectureProgress.Count
                    })
                    .FirstOrDefault(),
                TotalLectures = c.Chapters.Sum(ch => ch.Lectures.Count),
                c.Price,
                c.TimeEstimation,
                c.CourseLevel,
                FirstLectureId = c.Chapters
                    .Where(ch => ch.OrderIndex == 1)
                    .SelectMany(ch => ch.Lectures)
                    .Where(l => l.OrderIndex == 1)
                    .Select(l => l.Id)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        // Sử dụng Task.WhenAll để lấy các URL S3 song song và tạo DTO
        var courseDtos = await Task.WhenAll(courses.Select(async course =>
        {
            var completionPercentage = course.TotalLectures > 0
                ? Math.Round((double)(course.UserEnrollment?.LectureProgressCount ?? 0) / course.TotalLectures * 100, 2)
                : 0;

            var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60 * 24);

            return new UserEnrollmentDetailsDto(
                course.Id.Value,
                course.Title,
                course.Headline,
                s3Object.PresignedUrl!,
                course.UserEnrollment!.EnrollmentDate,
                course.UserEnrollment?.CompletionDate,
                course.UserEnrollment!.UserEnrollmentStatus.ToString(),
                completionPercentage,
                course.UserEnrollment.Rating,
                course.UserEnrollment.Feedback,
                course.FirstLectureId!.Value
            );
        }));

        return new GetUserEnrollmentCoursesResult(
            new PaginatedResult<UserEnrollmentDetailsDto>(pageIndex, pageSize, totalCount, courseDtos.ToList())
        );
    }
}