
namespace Learning.Application.Models.Courses.Queries.GetCourseProgress;
public class GetCourseProgressHandler(IUserEnrollmentRepository repository, IUserContextService userContext) : IQueryHandler<GetCourseProgressQuery, GetCourseProgressResult> {
    public async Task<GetCourseProgressResult> Handle(GetCourseProgressQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var userCourse =await repository.GetByUserIdAndCourseIdWithProgressAsync(userId, request.CourseId);
        if (userCourse == null) {
            return new GetCourseProgressResult(new());
        }
        var progress = userCourse.LectureProgress.Select(l => l.ToCourseProgressDto()).ToList();

        return new GetCourseProgressResult(progress);
    }
}

