using BuidingBlocks.Storage.Interfaces;
using Learning.Application.Data.Repositories;
using Learning.Application.Extensions;

namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public class GetCourseDetailsHandler(ICourseRepository courseRepository, IFilesService filesService) 
    : IQueryHandler<GetCourseDetailsQuery, GetCourseDetailsResult>
{
    public async Task<GetCourseDetailsResult> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken)
    {
        var course = await courseRepository.GetByIdDetailAsync(request.Id);
        if(course == null) {
            throw new NotFoundException("Course", request.Id);
        }
        var s3Object = await filesService.GetFileAsync(StorageConstants.BUCKET, course.ImageUrl, 60);
        var courseDto = course.ToCourseDetailsDto(s3Object.PresignedUrl!);

        return new GetCourseDetailsResult(courseDto);
    }
}

