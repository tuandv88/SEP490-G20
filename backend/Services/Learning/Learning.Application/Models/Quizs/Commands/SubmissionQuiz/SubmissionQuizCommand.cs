namespace Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
public record SubmissionQuizCommand(Guid QuizId): ICommand<SubmissionQuizResult>;
public record SubmissionQuizResult(string Status);
