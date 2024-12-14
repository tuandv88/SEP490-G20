
namespace Learning.Application.Models.Quizs.Queries.GetQuizSubmission;
public class GetQuizSubmissionHandler(IQuizSubmissionRepository repository, IUserContextService userContext) : IQueryHandler<GetQuizSubmissionQuery, GetQuizSubmissionResult> {
    public async Task<GetQuizSubmissionResult> Handle(GetQuizSubmissionQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var quizSubmission = await repository.GetByQuizAndUserIdAsync(request.QuizId, userId);
        var quizSubmissionSuccess = quizSubmission.Where(q => q.Status == QuizSubmissionStatus.Success);
        var quizSubmissionDto = quizSubmissionSuccess.Select(q => q.ToQuizSubmissionDto())
                                                    .OrderByDescending(qs => qs.SubmissionDate)                                        
                                                    .ToList();

        return new GetQuizSubmissionResult(quizSubmissionDto);
    }
}

