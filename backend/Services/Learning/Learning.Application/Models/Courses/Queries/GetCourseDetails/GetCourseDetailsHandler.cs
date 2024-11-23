namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public class GetCourseDetailsHandler(ICourseRepository courseRepository, IFilesService filesService, IUserContextService userContext, IUserCourseRepository userCourseRepository)
    : IQueryHandler<GetCourseDetailsQuery, GetCourseDetailsResult> {
    public async Task<GetCourseDetailsResult> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken) {
        var userRole = userContext.User.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        //Thêm điều kiện phải tham gia khóa học đấy nữa
        if (!isAdmin) {
            var userId = userContext.User.Id;
            var userCourse = await userCourseRepository.GetByUserIdAndCourseIdWithProgressAsync(userId, request.Id);
            if (userCourse == null) {
                throw new ForbiddenAccessException();
            }
        }

        var course = await courseRepository.GetByIdDetailAsync(request.Id);
        if (course == null) {
            throw new NotFoundException(nameof(Course), request.Id);
        }

        var isPublished = course.CourseStatus == CourseStatus.Published;
        if (!isAdmin && !isPublished) {
            throw new NotFoundException("Course", request.Id);
        }

        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 24*60);
        var courseDto = course.ToCourseDetailsDto(s3Object.PresignedUrl!);

        return new GetCourseDetailsResult(courseDto);
    }
}

