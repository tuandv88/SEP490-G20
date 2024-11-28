
namespace Learning.Application.Models.Courses.Commands.CreateCoureReview;
public class CreateCourseReviewHandler(IUserEnrollmentRepository repository, IUserContextService userContext) : ICommandHandler<CreateCoureReviewCommand, CreateCourseReviewResult> {
    public async Task<CreateCourseReviewResult> Handle(CreateCoureReviewCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var userEnrollment = await repository.GetByUserIdAndCourseIdAsync(userId, request.CourseId);
        if(userEnrollment == null) {
            throw new ForbiddenAccessException();
        }
        if(userEnrollment.Rating!= -1) {
            return new CreateCourseReviewResult(false);
        }
        userEnrollment.AddReview(request.CourseReview.Rating, request.CourseReview.Feedback);
        await repository.UpdateAsync(userEnrollment);
        await repository.SaveChangesAsync(cancellationToken);

        return new CreateCourseReviewResult(true);
    }
}
