namespace Learning.Application.Models.Submissions.Queries.GetProblemSubmissionsByRank;
public record GetProblemSubmissionsByRankQuery(Guid ProblemId) : IQuery<GetProblemSubmissionByRankResult>;
public record GetProblemSubmissionByRankResult();

