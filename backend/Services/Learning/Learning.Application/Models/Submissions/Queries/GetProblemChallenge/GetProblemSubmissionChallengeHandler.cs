
using Learning.Application.Models.Submissions.Dtos;
using Microsoft.IdentityModel.Tokens;

namespace Learning.Application.Models.Submissions.Queries.GetProblemChallenge;
public class GetProblemSubmissionChallengeHandler(IProblemSubmissionRepository problemSubmissionRepository, IUserContextService userContext) : IQueryHandler<GetProblemSubmissionChallengeQuery, GetProblemSubmissionChallengeResult> {
    public async Task<GetProblemSubmissionChallengeResult> Handle(GetProblemSubmissionChallengeQuery request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var submissions = await problemSubmissionRepository.GetByProblemIdAndUserIdAsync(request.ProblemId, userId);
        if (submissions.IsNullOrEmpty()) {
            return new GetProblemSubmissionChallengeResult([]);
        }
        var submissionDtos = submissions.Select(s => {

            var firstFailedTestCase = s.TestResults
            .FirstOrDefault(tr => !tr.IsPass);

            var totalTestCase = s.TestResults.Count;
            var testCasePass = s.TestResults.Count(tr => tr.IsPass);
            return new SubmissionResponseDto(s.TokenReference,s.SourceCode, s.RunTimeErrors, s.CompileErrors, s.ExecutionTime,
                s.MemoryUsage, firstFailedTestCase, s.Status, s.LanguageCode.ToString(), totalTestCase, testCasePass
            );
        }).ToList();

        return new GetProblemSubmissionChallengeResult(submissionDtos);
    }
}
