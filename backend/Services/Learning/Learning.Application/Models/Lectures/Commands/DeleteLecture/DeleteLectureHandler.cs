namespace Learning.Application.Models.Lectures.Commands.DeleteLecture;
public class DeleteLectureHandler(IChapterRepository chapterRepository, ILectureRepository lectureRepository, 
    IProblemRepository problemRepository, IQuizRepository quizRepository) : ICommandHandler<DeleteLectureCommand, Unit> {
    public async Task<Unit> Handle(DeleteLectureCommand request, CancellationToken cancellationToken) {
        var chapter = await chapterRepository.GetByIdDetailAsync(request.ChapterId);
        if (chapter == null) {
            throw new NotFoundException(nameof(Chapter), request.ChapterId);
        }
        var lecture = chapter.DeleteLecture(LectureId.Of(request.LectureId));
        chapter.ReorderLectures();

        if (lecture.ProblemId != null) {
            //Cần gọi hàm thêm event nếu cần
            await problemRepository.DeleteByIdAsync(lecture.ProblemId.Value);
        }
        if(lecture.QuizId != null) {
            //Cần gọi hàm thêm event nếu cần
            await quizRepository.DeleteByIdAsync(lecture.QuizId.Value);
        }

        await lectureRepository.DeleteAsync(lecture);
        await lectureRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;

    }
}

