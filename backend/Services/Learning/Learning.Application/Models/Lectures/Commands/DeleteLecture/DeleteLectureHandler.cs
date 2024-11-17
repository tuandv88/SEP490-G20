namespace Learning.Application.Models.Lectures.Commands.DeleteLecture;
public class DeleteLectureHandler(IChapterRepository chapterRepository, ILectureRepository lectureRepository, 
    IProblemRepository problemRepository, IQuizRepository quizRepository) : ICommandHandler<DeleteLectureCommand, Unit> {
    public async Task<Unit> Handle(DeleteLectureCommand request, CancellationToken cancellationToken) {
        var chapter = await chapterRepository.GetByIdDetailAsync(request.ChapterId);
        if (chapter == null) {
            throw new NotFoundException("Chapter", request.ChapterId);
        }
        var lecture =  DeleteLecture(chapter, request.LectureId);

        if(lecture.ProblemId != null) {
            await problemRepository.DeleteByIdAsync(lecture.ProblemId.Value);
        }
        if(lecture.QuizId != null) {
            await quizRepository.DeleteByIdAsync(lecture.QuizId.Value);
        }

        await lectureRepository.DeleteAsync(lecture);
        await lectureRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;

    }

    private Lecture DeleteLecture(Chapter chapter, Guid lectureId) {
       var lecture =  chapter.DeleteLecture(LectureId.Of(lectureId));
        return lecture;
    }
}

