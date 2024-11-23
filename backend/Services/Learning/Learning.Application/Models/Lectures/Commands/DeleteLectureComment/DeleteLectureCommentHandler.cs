
namespace Learning.Application.Models.Lectures.Commands.DeleteLectureComment;
public class DeleteLectureCommentHandler(ICourseRepository courseRepository, IUserContextService userContext,
    IUserCourseRepository userCourseRepository, ILectureCommentRepository lectureCommentRepository) : ICommandHandler<DeleteLectureCommentCommand, Unit> {
    public async Task<Unit> Handle(DeleteLectureCommentCommand request, CancellationToken cancellationToken) {
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
        await lectureCommentRepository.DeleteAsync(lectureComment);
        await lectureCommentRepository.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

