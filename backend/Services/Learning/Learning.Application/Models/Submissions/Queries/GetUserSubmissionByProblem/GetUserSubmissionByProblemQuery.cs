using Learning.Application.Models.Submissions.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Submissions.Queries.GetUserSubmissionByProblem;

[Authorize]
public record GetUserSubmissionByProblemQuery(Guid ProblemId): IQuery<GetUserSubmissionByProblemResult>;
public record GetUserSubmissionByProblemResult(List<SubmissionLectureViewDto> Submissions);

