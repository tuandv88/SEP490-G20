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
}

