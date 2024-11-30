namespace Learning.Application.Models.Courses.Commands.DeleteCourse;

public class DeleteCourseHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository,
    IProblemRepository problemRepository, IQuizRepository quizRepository, ILectureRepository lectureRepository) : ICommandHandler<DeleteCourseCommand, Unit> {
    public async Task<Unit> Handle(DeleteCourseCommand request, CancellationToken cancellationToken) {

        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);

        if (course == null) {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }
        foreach (var chapter in course.Chapters) {
            foreach (var lecture in chapter.Lectures) {
                if (lecture.ProblemId != null) {
                    await problemRepository.DeleteByIdAsync(lecture.ProblemId.Value);
                }
                if (lecture.QuizId != null) {
                    await quizRepository.DeleteByIdAsync(lecture.QuizId.Value);
                }
            }
            await lectureRepository.DeleteAsync(chapter.Lectures.ToArray());
        }

        await chapterRepository.DeleteAsync(course.Chapters.ToArray());

        await courseRepository.DeleteAsync(course);

        await courseRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}