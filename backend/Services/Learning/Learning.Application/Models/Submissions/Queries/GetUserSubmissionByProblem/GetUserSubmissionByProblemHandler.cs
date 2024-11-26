namespace Learning.Application.Models.Submissions.Queries.GetUserSubmissionByProblem;
public class GetUserSubmissionByProblemHandler(IProblemSubmissionRepository repository, IUserContextService userContext) : IQueryHandler<GetUserSubmissionByProblemQuery, GetUserSubmissionByProblemResult> {
    public async Task<GetUserSubmissionByProblemResult> Handle(GetUserSubmissionByProblemQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var problemSubmission = await repository.GetByProblemIdAndUserIdAsync(request.ProblemId, userId);

        var submission = problemSubmission
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => p.ToSubmissionLectureViewDto()).ToList();

        return new GetUserSubmissionByProblemResult(submission);
    }
}

