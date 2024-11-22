using Learning.Application.Models.Quizs.Queries.GetQuizSubmissionDetails;

namespace Learning.Application.Models.Quizs.Queries.GetAnswerQuizSubmission;
public class GetAnswerQuizSubmissionHandler(IQuizSubmissionRepository repository, IUserContextService userContext): IQueryHandler<GetAnswerQuizSubmissionQuery, GetAnswerQuizSubmissionResult> {
    public async Task<GetAnswerQuizSubmissionResult> Handle(GetAnswerQuizSubmissionQuery request, CancellationToken cancellationToken) {
        

        var submission = await repository.GetByIdAsync(request.QuizSubmissionId);
        if (submission == null) {
            throw new NotFoundException(nameof(QuizSubmission), request.QuizSubmissionId);
        }
        var userRole = userContext.User.Role;
        var userId = userContext.User.Id;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin || !submission.UserId.Equals(UserId.Of(userId))) {
            throw new NotFoundException(nameof(QuizSubmission), request.QuizSubmissionId);
        }

        if (submission.Status != QuizSubmissionStatus.Success) {
            throw new InvalidOperationException($"Quiz submission is not success, current state is {submission.Status}");
        }
        return new GetAnswerQuizSubmissionResult(submission.ToQuizSubmissionDto(true));
    }
}

