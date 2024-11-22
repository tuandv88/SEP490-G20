namespace Learning.Application.Models.Quizs.Commands.DeleteQuiz;
public class DeleteQuizHandler(IQuizRepository repository, IProblemRepository problemRepository, ILectureRepository lectureRepository) : ICommandHandler<DeleteQuizCommand, Unit> {
    public async Task<Unit> Handle(DeleteQuizCommand request, CancellationToken cancellationToken) {
        var quiz = await repository.GetByIdDetailAsync(request.QuizId);
        if(quiz == null) {
            throw new NotFoundException(nameof(quiz), request.QuizId);
        }
        var lecture = await lectureRepository.GetByQuizIdAsync(request.QuizId);
        if (lecture != null) {
            lecture.QuizId = null;
            await lectureRepository.UpdateAsync(lecture);
        }
        foreach (var question in quiz.Questions) {
            if(question.ProblemId != null) {
                await problemRepository.DeleteByIdAsync(question.ProblemId.Value);
                question.ProblemId = null;
            }
        }
        await repository.DeleteAsync(quiz);
        await repository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

