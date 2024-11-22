namespace Learning.Application.Models.Quizs.Queries.GetQuizById;
public class GetQuizByIdHandler(IQuizRepository repository, IUserContextService userContext,
    IQuizSubmissionRepository quizSubmissionRepository
    ) : IQueryHandler<GetQuizByIdQuery, GetQuizByIdResult> {
    public async Task<GetQuizByIdResult> Handle(GetQuizByIdQuery request, CancellationToken cancellationToken) {

        var quiz = await repository.GetByIdAsync(request.Id);
        if (quiz == null || !quiz.IsActive) {
            throw new NotFoundException(nameof(Quiz), request.Id);
        }
        var userRole = userContext.User?.Role;
        var isAdmin = userRole == PoliciesType.Administrator;

        if (!isAdmin && !quiz.IsActive) {
            throw new NotFoundException(nameof(Quiz), request.Id);
        }

        var userId = userContext.User?.Id;
        var attemptCount = userId != null && userId != Guid.Empty ? await quizSubmissionRepository.CountByQuizAndUser(quiz.Id.Value, userId.Value) : 0;

        return new GetQuizByIdResult(quiz.ToQuizDto(attemptCount));
    }
}

