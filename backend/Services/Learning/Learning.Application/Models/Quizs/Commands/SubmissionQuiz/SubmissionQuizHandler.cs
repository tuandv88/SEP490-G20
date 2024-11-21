namespace Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
public class SubmissionQuizHandler(IQuizRepository quizRepository, IUserContextService userContext) : ICommandHandler<SubmissionQuizCommand, SubmissionQuizResult> {
    public async Task<SubmissionQuizResult> Handle(SubmissionQuizCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        var quiz = await quizRepository.GetByIdDetailAsync(request.QuizId);
        if (quiz == null) { 
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        var submissionId = Guid.NewGuid();
        var submission = new QuizSubmission() {
            UserId = UserId.Of(userId),
            QuizId = quiz.Id,
            SubmissionDate = DateTime.UtcNow,
            Status = QuizSubmissionStatus.Processing,

        };
        throw new NotImplementedException();

    }
}

