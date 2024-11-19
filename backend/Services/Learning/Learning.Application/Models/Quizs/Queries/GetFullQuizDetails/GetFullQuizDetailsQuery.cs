using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetFullQuizDetails;
[Authorize(Roles = $"{RoleType.Administrator}")]
public record GetFullQuizDetailsQuery(Guid Id) : IQuery<GetFullQuizDetailsResult>;
public record GetFullQuizDetailsResult(QuizFullDto Quiz);
