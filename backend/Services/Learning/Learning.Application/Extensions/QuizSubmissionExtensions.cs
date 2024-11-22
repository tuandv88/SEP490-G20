using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Extensions;
public static class QuizSubmissionExtensions {
    public static QuizSubmissionDto ToQuizSubmissionDto(this QuizSubmission quizSubmission, bool inAnswer = false) {
        return new QuizSubmissionDto(
                quizSubmission.Id.Value,
                quizSubmission.StartTime,
                quizSubmission.SubmissionDate,
                quizSubmission.Score,
                quizSubmission.TotalScore,
                quizSubmission.TotalQuestions,
                quizSubmission.CorrectAnswers,
                quizSubmission.PassingMark,
                quizSubmission.Duration,
                quizSubmission.Status.ToString(),
                Answer: inAnswer ? quizSubmission.Answers : null
            );
    }
}

