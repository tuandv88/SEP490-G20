
namespace Learning.Application.Models.Courses.Queries.GetStatusEnrollment;
public class GetStatusEnrollmentHandler(IUserContextService userContext, IUserCourseRepository userCourseRepository) : IQueryHandler<GetStatusEnrollmentQuery, GetStatusEnrollmentResult> {
    public async Task<GetStatusEnrollmentResult> Handle(GetStatusEnrollmentQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        if (userId.Equals(Guid.Empty)){
            return new GetStatusEnrollmentResult(false);
        }
        var course = await userCourseRepository.GetByUserIdAndCourseId(userId, request.CourseId);
        if(course == null) {
            return new GetStatusEnrollmentResult(false);
        } else {
            return new GetStatusEnrollmentResult(true);
        }
    }
}
