using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Submissions.Queries.GetProblemChallenge;
[Authorize]
public record GetProblemSubmissionChallengeQuery(Guid ProblemId): IQuery<GetProblemSubmissionChallengeResult>;
public record GetProblemSubmissionChallengeResult(List<SubmissionResponseDto> Submissions);

