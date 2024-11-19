namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public class GetCourseDetailsHandler(ICourseRepository courseRepository, IFilesService filesService, IUserContextService userContext) 
    : IQueryHandler<GetCourseDetailsQuery, GetCourseDetailsResult>
{
    public async Task<GetCourseDetailsResult> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken)
    {
        var userRole = userContext.User?.Role;

        var course = await courseRepository.GetByIdDetailAsync(request.Id);
        if (course == null) {
            throw new NotFoundException("Course", request.Id);
        }

        var isAdmin = userRole == RoleType.Administrator;
        var isPublished = course.CourseStatus == CourseStatus.Published;

        if (!isAdmin && !isPublished) {
            throw new NotFoundException("Course", request.Id);
        }
        //Thêm điều kiện phải tham gia khóa học đấy nữa

        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60);
        var courseDto = course.ToCourseDetailsDto(s3Object.PresignedUrl!);

        return new GetCourseDetailsResult(courseDto);
    }
}

