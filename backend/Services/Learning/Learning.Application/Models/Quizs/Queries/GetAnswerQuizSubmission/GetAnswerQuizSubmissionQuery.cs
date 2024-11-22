using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizSubmissionDetails;
[Authorize]
public record GetAnswerQuizSubmissionQuery(Guid QuizSubmissionId) : IQuery<GetAnswerQuizSubmissionResult>;
public record GetAnswerQuizSubmissionResult(QuizSubmissionDto QuizSubmission);
