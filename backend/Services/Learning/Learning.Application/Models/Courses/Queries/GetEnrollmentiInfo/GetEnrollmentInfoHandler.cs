
namespace Learning.Application.Models.Courses.Queries.GetStatusEnrollment;
public class GetEnrollmentInfoHandler(IUserContextService userContext, IUserEnrollmentRepository userCourseRepository) : IQueryHandler<GetEnrollmentInfoQuery, GetEnrollmentInfoResult> {
    public async Task<GetEnrollmentInfoResult> Handle(GetEnrollmentInfoQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        if (userId.Equals(Guid.Empty)){
            return new GetEnrollmentInfoResult(null);
        }
        var userCourse = await userCourseRepository.GetByUserIdAndCourseIdAsync(userId, request.CourseId);
        if(userCourse == null) {
            return new GetEnrollmentInfoResult(null);
        } else {
            return new GetEnrollmentInfoResult(userCourse.ToUserEnrollmentDto());
        }
    }
}
