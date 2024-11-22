
namespace Learning.Application.Models.Lectures.Commands.CreateLectureComment;
public class CreateLectureCommentHandler(ICourseRepository courseRepository, IUserContextService userContext, 
    IUserCourseRepository userCourseRepository, ILectureCommentRepository lectureCommentRepository) : ICommandHandler<CreateLectureCommentCommand, CreateLectureCommentResult> {
    public async Task<CreateLectureCommentResult> Handle(CreateLectureCommentCommand request, CancellationToken cancellationToken) {
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
        var lectureComment = CreateNewLectureComment(lecture, userId, request.Comment);

        await lectureCommentRepository.AddAsync(lectureComment);
        await lectureCommentRepository.SaveChangesAsync(cancellationToken);
        return new CreateLectureCommentResult(lectureComment.Id.Value);
    }

    private LectureComment CreateNewLectureComment(Lecture lecture, Guid userId, string content) {
        var lectureComment = LectureComment.Create(
                LectureCommentId.Of(Guid.NewGuid()),
                UserId.Of(userId),
                lecture.Id,
                content);
        lecture.AddComments(lectureComment);
        return lectureComment;

    }
}

