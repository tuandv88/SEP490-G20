using Learning.Application.Models.QuestionOptions.Dtos;

namespace Learning.Application.Extensions;
public static class QuestionOptionExtensions {
    public static QuestionOptionDto ToQuestionOptionDto(this QuestionOption questionOption) {
        return new QuestionOptionDto(
                Id: questionOption.Id.Value,
                Content: questionOption.Content,
                OrderIndex: questionOption.OrderIndex
            );
    }

    public static List<QuestionOptionDto> ToListQuestionOptionDto(this List<QuestionOption> questionOptions) {
        return questionOptions.Select(q => q.ToQuestionOptionDto()).ToList();
    }
    public static List<QuestionOptionFullDto> ToListQuestionOptionFullDto(this List<QuestionOption> questionOptions) {
        return questionOptions.Select(q => q.ToQuestionOptionFullDto()).ToList();
    }

    public static QuestionOptionFullDto ToQuestionOptionFullDto(this QuestionOption questionOption) {
        return new QuestionOptionFullDto(
                Id: questionOption.Id.Value,
                Content: questionOption.Content,
                OrderIndex: questionOption.OrderIndex,
                IsCorrect: questionOption.IsCorrect
            );
    }
}

