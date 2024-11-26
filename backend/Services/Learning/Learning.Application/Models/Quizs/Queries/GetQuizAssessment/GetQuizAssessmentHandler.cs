
namespace Learning.Application.Models.Quizs.Queries.GetQuizAssessment;
public class GetQuizAssessmentHandler(IQuizRepository repository, IUserContextService userContext,
    IQuizSubmissionRepository quizSubmissionRepository) : IQueryHandler<GetQuizAssessmentQuery, GetQuizAssessmentResult> {
    public async Task<GetQuizAssessmentResult> Handle(GetQuizAssessmentQuery request, CancellationToken cancellationToken) {
        var quiz = await repository.GetQuizAssessment();
        if (quiz == null || !quiz.IsActive) {
            throw new NotFoundException(nameof(Quiz));
        }
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin && !quiz.IsActive) {
            throw new NotFoundException(nameof(Quiz));
        }

        var userId = userContext.User?.Id;
        var attemptCount = userId != null && userId != Guid.Empty ? await quizSubmissionRepository.CountByQuizAndUser(quiz.Id.Value, userId.Value) : 0;

        return new GetQuizAssessmentResult(quiz.ToQuizDto(attemptCount));
    }
}

