using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizDetails;
[Authorize]
public record GetQuizDetailQuery(Guid Id) : IQuery<GetQuizDetailResult>;
public record GetQuizDetailResult(QuizDetailDto Quiz, QuizAnswerDto Answer);

