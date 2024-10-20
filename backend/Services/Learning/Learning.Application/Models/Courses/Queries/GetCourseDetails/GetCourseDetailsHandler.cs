namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public class GetCourseDetailsHandler : IQueryHandler<GetCourseDetailsQuery, GetCourseDetailsResult>
{
    public Task<GetCourseDetailsResult> Handle(GetCourseDetailsQuery request, CancellationToken cancellationToken)
    {
        //TODO
        throw new NotImplementedException();
    }
}

