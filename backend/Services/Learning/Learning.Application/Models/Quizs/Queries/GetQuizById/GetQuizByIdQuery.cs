using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizById;

[Authorize]
public record GetQuizByIdQuery(Guid Id): IQuery<GetQuizByIdResult>;
public record GetQuizByIdResult(QuizDto Quiz);

