using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizStatus;

[Authorize]
public record GetQuizStatusQuery(Guid QuizId) : IQuery<GetQuizStatusResult>;
public record GetQuizStatusResult(string Status);