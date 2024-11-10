using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Extensions;
public static class QuizExtensions {
    public static QuizDto ToQuizDto(this Quiz quiz) {
        var questions = quiz.IsRandomized
                ? quiz.Questions.OrderBy(_ => Guid.NewGuid()).ToList()
                : quiz.Questions.OrderBy(q => q.OrderIndex).ToList();
        return new QuizDto(
        Id: quiz.Id.Value,
        Title: quiz.Title,
        Description: quiz.Description,
        PassingMark: quiz.PassingMark,
        TimeLimit: quiz.TimeLimit,
        HasTimeLimit: quiz.HasTimeLimit,
        AttemptLimit: quiz.AttemptLimit,
        HasAttemptLimit: quiz.HasAttemptLimit,
        Questions: questions.ToListQuestionDto());

    }
}

