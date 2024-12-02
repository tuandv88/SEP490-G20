using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;
namespace Learning.Application.Models.Quizs.Queries.GetQuizAssessmentSubmission;

[Authorize]
public record GetQuizAssessmentSubmissionQuery : IQuery<GetQuizAssessmentSubmissionResult>;
public record GetQuizAssessmentSubmissionResult(List<QuizSubmissionAssessmentDto> Quízs);
