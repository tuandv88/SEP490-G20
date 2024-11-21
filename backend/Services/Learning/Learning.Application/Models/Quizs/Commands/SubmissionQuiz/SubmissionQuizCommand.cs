namespace Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
public record SubmissionQuizCommand(Guid QuizSubmissionId): ICommand<SubmissionQuizResult>;
public record SubmissionQuizResult(string Status);
