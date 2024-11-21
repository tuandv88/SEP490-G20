using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Quizs.Queries.GetQuizById;
public record GetQuizByIdQuery(Guid Id): IQuery<GetQuizByIdResult>;
public record GetQuizByIdResult(QuizDto Quiz);

