using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Quizs.Queries.GetQuizAssessment;
[Authorize]
public record GetQuizAssessmentQuery: IQuery<GetQuizAssessmentResult>;
public record GetQuizAssessmentResult(QuizDto Quiz);

