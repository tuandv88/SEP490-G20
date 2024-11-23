
namespace Learning.Application.Models.Lectures.Commands.UpdateLectureComment;
public class UpdateLectureCommentHandler(ICourseRepository courseRepository, IUserContextService userContext,
    IUserCourseRepository userCourseRepository, ILectureCommentRepository lectureCommentRepository) : ICommandHandler<UpdateLectureCommentCommand, UpdateLectureCommentResult> {
    public async Task<UpdateLectureCommentResult> Handle(UpdateLectureCommentCommand request, CancellationToken cancellationToken) {
        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);
        if (course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }
        var userId = userContext.User.Id;
        var userCourse = await userCourseRepository.GetByUserIdAndCourseIdWithProgressAsync(userId, course.Id.Value);
        if (userCourse == null) {
            throw new ForbiddenAccessException();
        }
        var lecture = course.Chapters
          .SelectMany(chapter => chapter.Lectures)
          .FirstOrDefault(lec => lec.Id.Equals(LectureId.Of(request.LectureId)));
        if (lecture == null) {
            throw new NotFoundException(nameof(Lecture), request.LectureId);
        }
        var lectureComment = await lectureCommentRepository.GetByUserIdAsync(userId, request.LectureCommentId);
        if (lectureComment == null) {
            throw new NotFoundException(nameof(LectureComment), request.LectureCommentId);
        }
        lectureComment.Content = request.Comment.Content;
        await lectureCommentRepository.UpdateAsync(lectureComment);
        await lectureCommentRepository.SaveChangesAsync(cancellationToken);

        return new UpdateLectureCommentResult(true);
    }
}

