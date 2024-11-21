namespace Learning.Application.Models.Quizs.Commands.DeleteQuiz;
public record DeleteQuizCommand(Guid QuizId) : ICommand;