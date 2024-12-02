
using Learning.Application.Models.Courses.Dtos;
using System.Linq;

namespace Learning.Application.Models.Courses.Queries.GetUserEnrollmentCourses;
public class GetUserEnrollementCoursesHandler(ICourseRepository repository, IFilesService filesService, IUserContextService userContext) : IQueryHandler<GetUserEnrollmentCoursesQuery, GetUserEnrollmentCoursesResult> {
    public async Task<GetUserEnrollmentCoursesResult> Handle(GetUserEnrollmentCoursesQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var userRole = userContext.User.Role;
        var isAdmin = userRole == PoliciesType.Administrator;


        // Lọc các khóa học mà user đã tham gia
        var filteredData = repository.GetAllAsQueryable()
                                     .Include(c => c.UserEnrollments)
                                     .ThenInclude(ue => ue.LectureProgress)
                                     .Include(c => c.Chapters)
                                     .ThenInclude(ch => ch.Lectures).AsQueryable();

        // Nếu courseIdArray không rỗng, thêm điều kiện lọc theo danh sách CourseIds
        if (request.CourseIds != null && request.CourseIds.Any()) {
            var courseIdList = request.CourseIds.ToList();
            var courseIdArray = courseIdList.Select(c => CourseId.Of(Guid.Parse(c))).ToList();
            filteredData = filteredData.Where(c => courseIdArray.Contains(c.Id));
        }
        filteredData = filteredData.Where(c => c.UserEnrollments.Any(ue => ue.UserId.Equals(UserId.Of(userId))));
        if (!isAdmin) {
            filteredData = filteredData.Where(c => c.CourseStatus == CourseStatus.Published);
        }

        // Phân trang
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = await filteredData.CountAsync(cancellationToken);
        var courses = await filteredData.OrderByDescending(c => c.UserEnrollments.Count)
                                        .Skip(pageSize * (pageIndex - 1))
                                        .Take(pageSize)
                                        .ToListAsync(cancellationToken);

        var courseDetailsDtos = courses.Select(course => {
            var userEnrollment = course.UserEnrollments.First(ue => ue.UserId.Equals(UserId.Of(userId)));


            var totalLectures = course.Chapters.Sum(ch => ch.Lectures.Count);
            var completedLectures = userEnrollment.LectureProgress.Count();
            var completionPercentage = totalLectures > 0
                ? Math.Round((double)completedLectures / totalLectures * 100, 2)
                : 0;
            var s3Object = filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60 * 24).Result;

            var firstChapter = course.Chapters.FirstOrDefault(c => c.OrderIndex == 1);
            var firstLecture = firstChapter?.Lectures.FirstOrDefault(l => l.OrderIndex == 1);
            return new UserEnrollmentDetailsDto(
                course.Id.Value,
                course.Title,
                course.Headline,
                s3Object.PresignedUrl!,
                userEnrollment.EnrollmentDate,
                userEnrollment.CompletionDate,
                userEnrollment.UserEnrollmentStatus.ToString(),
                completionPercentage,
                firstLecture != null ? firstLecture.Id.Value : Guid.Empty
            );
        }).ToList();

        return new GetUserEnrollmentCoursesResult(
            new PaginatedResult<UserEnrollmentDetailsDto>(pageIndex, pageSize, totalCount, courseDetailsDtos)
        );
    }
}
