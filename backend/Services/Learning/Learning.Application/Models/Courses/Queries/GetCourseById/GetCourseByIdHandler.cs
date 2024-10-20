using Learning.Application.Data.Repositories;
namespace Learning.Application.Models.Courses.Queries.GetCourseById;
public class GetCourseByIdHandler(ICourseRepository repository)
    : IQueryHandler<GetCourseByIdQuery, GetCourseByIdResult>
{
    public async Task<GetCourseByIdResult> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var course = await repository.GetByIdAsync(request.Id);
        if (course == null)
        {
            throw new NotFoundException("Course", request.Id);
        }
        return new GetCourseByIdResult(course.ToCourseDto());
    }
}

