namespace Learning.Application.Models.Courses.Queries.GetCourseById;
public class GetCourseByIdHandler(ICourseRepository repository, IFilesService filesService)
    : IQueryHandler<GetCourseByIdQuery, GetCourseByIdResult>
{
    public async Task<GetCourseByIdResult> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var course = await repository.GetByIdAsync(request.Id);
        if (course == null)
        {
            throw new NotFoundException("Course", request.Id);
        }

        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60);
        var courseDto = course.ToCourseDto(s3Object.PresignedUrl!);
        
        return new GetCourseByIdResult(courseDto);
    }
}

