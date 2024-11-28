using System.Transactions;

namespace Learning.Application.Models.Chapters.Commands.DeleteChapter;
public class DeleteChapterHandler(ICourseRepository courseRepository, IChapterRepository chapterRepository,
    IProblemRepository problemRepository, IQuizRepository quizRepository, ILectureRepository lectureRepository
    ) : ICommandHandler<DeleteChapterCommand, Unit>
{
    public async Task<Unit> Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        var course = await courseRepository.GetByIdDetailAsync(request.CourseId);

        if (course == null)
        {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }

        var chapter = course.DeleteChapter(ChapterId.Of(request.ChapterId));
        var lectures = chapter.DeleteLectures();
        foreach (var lecture in lectures)
        {
            if (lecture.ProblemId != null)
            {
                //Cần gọi hàm thêm event nếu cần
                await problemRepository.DeleteByIdAsync(lecture.ProblemId.Value);
            }
            if (lecture.QuizId != null)
            {
                //Cần gọi hàm thêm event nếu cần
                await quizRepository.DeleteByIdAsync(lecture.QuizId.Value);
            }
        }
        await lectureRepository.DeleteAsync(lectures.ToArray());
        await chapterRepository.DeleteAsync(chapter);

        await chapterRepository.SaveChangesAsync(cancellationToken);
        return Unit.Value;

    }


}

