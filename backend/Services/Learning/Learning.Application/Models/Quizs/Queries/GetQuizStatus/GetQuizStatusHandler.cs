namespace Learning.Application.Models.Quizs.Queries.GetQuizStatus;

public class GetQuizStatusHandler(IQuizSubmissionRepository quizSubmissionRepository, IQuizRepository quizRepository, 
    IUserContextService userContext) : IQueryHandler<GetQuizStatusQuery, GetQuizStatusResult>
{
    public async Task<GetQuizStatusResult> Handle(GetQuizStatusQuery request, CancellationToken cancellationToken)
    {
        var quiz = await quizSubmissionRepository.GetByIdAsync(request.QuizId);
        if (quiz == null)
        {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        
        var userId = userContext.User.Id;
        var quizSubmission = await quizSubmissionRepository.GetSubmissionInProgressAsync(request.QuizId, userId);
        return quizSubmission == null ? new GetQuizStatusResult("NotStarted") : new GetQuizStatusResult(QuizSubmissionStatus.InProgress.ToString());
    }
}