using Learning.Application.Models.Problems.Commands.DeleteProblem;

namespace Learning.Application.Models.Questions.Commands.DeleteQuestion;
public class DeleteQuestionHandler(IQuizRepository quizRepository, IQuestionRepository questionRepository,
    IProblemRepository problemRepository, ISender sender) : ICommandHandler<DeleteQuestionCommand, Unit> {
    public async Task<Unit> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken) {
        var quiz = await quizRepository.GetByIdDetailAsync(request.QuizId);
        if (quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        var question = quiz.Questions.FirstOrDefault(q => q.Id.Equals(QuestionId.Of(request.QuestionId)));
        if (question == null) {
            throw new NotFoundException(nameof(Question), request.QuestionId);
        }

        if (question.ProblemId != null) {
            await problemRepository.DeleteByIdAsync(question.ProblemId.Value);
            question.ProblemId = null;
        }
        quiz.RemoveQuestion(question);
        await questionRepository.DeleteAsync(question);
        await quizRepository.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

