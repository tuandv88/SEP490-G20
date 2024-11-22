using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizSubmission;

[Authorize]
public record GetQuizSubmissionQuery(Guid QuizId) : IQuery<GetQuizSubmissionResult>;
public record GetQuizSubmissionResult(List<QuizSubmissionDto> QuizSubmissions);

