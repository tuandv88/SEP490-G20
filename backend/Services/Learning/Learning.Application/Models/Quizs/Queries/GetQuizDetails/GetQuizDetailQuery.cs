using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Quizs.Queries.GetQuizDetails;
public record GetQuizDetailQuery(Guid Id) : IQuery<GetQuizDetailResult>;
public record GetQuizDetailResult(QuizDto QuizDto);

