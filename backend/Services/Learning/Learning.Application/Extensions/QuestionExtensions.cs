using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Extensions;
public static class QuestionExtensions {
    public static QuestionDto ToQuestionDto(this Question question) {
        return new QuestionDto(
            Id: question.Id.Value,
            Content: question.Content,
            QuestionType: question.QuestionType.ToString(),
            QuestionLevel: question.QuestionLevel.ToString(),
            Mark: question.Mark,
            OrderIndex: question.OrderIndex,
            ProblemId: question.ProblemId != null ? question.ProblemId.Value : null,
            QuestionOptions: question.QuestionOptions.ToListQuestionOptionDto()
        );
    }
    public static List<QuestionDto> ToListQuestionDto(this List<Question> questions) {
        var questionsDto = questions.Select(q => q.ToQuestionDto()).ToList();
        return questionsDto;
    }

    public static QuestionFullDto ToQuestionFullDto(this Question question) {
        return new QuestionFullDto(
            Id: question.Id.Value,
            IsActive: question.IsActive,
            Content: question.Content,
            QuestionType: question.QuestionType.ToString(),
            QuestionLevel: question.QuestionLevel.ToString(),
            Mark: question.Mark,
            OrderIndex: question.OrderIndex,
            ProblemId: question.ProblemId != null ? question.ProblemId.Value : null,
            QuestionOptions: question.QuestionOptions.ToListQuestionOptionFullDto()
        );
    }
    public static List<QuestionFullDto> ToListFullQuestionDto(this List<Question> questions) {
        var questionsDto = questions.OrderBy(q => q.CreatedAt).Select(q => q.ToQuestionFullDto()).ToList();
        return questionsDto;
    }
}

