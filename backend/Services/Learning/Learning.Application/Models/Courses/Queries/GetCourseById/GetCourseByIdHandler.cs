namespace Learning.Application.Models.Courses.Queries.GetCourseById;
public class GetCourseByIdHandler(ICourseRepository repository, IFilesService filesService, IUserContextService userContext)
    : IQueryHandler<GetCourseByIdQuery, GetCourseByIdResult>
{
    public async Task<GetCourseByIdResult> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var userRole = userContext.User?.Role;

        var course = await repository.GetByIdAsync(request.Id);
        if (course == null) {
            throw new NotFoundException("Course", request.Id);
        }

        var isAdmin = userRole == PoliciesType.Administrator;
        var isPublished = course.CourseStatus == CourseStatus.Published;

        if (!isAdmin && !isPublished) {
            throw new NotFoundException("Course", request.Id);
        }
        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60);
        var courseDto = course.ToCourseDto(s3Object.PresignedUrl!);
        
        return new GetCourseByIdResult(courseDto);
    }
}

