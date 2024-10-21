using Learning.Application.Data.Repositories;

namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public class GetCourseDetailsHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository, ILectureRepository lectureRepository) 
    : IQueryHandler<GetCourseDetailsQuery, GetCourseDetailsResult>
{
    public async Task<GetCourseDetailsResult> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken)
    {
        var course = await courseRepository.GetByIdDetailAsync(request.Id);
        if(course == null) {
            throw new NotFoundException("Course", request.Id);
        }
        var courseDto = course.ToCourseDetailsDto();

        return new GetCourseDetailsResult(courseDto);
    }
}

