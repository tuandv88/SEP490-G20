using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.QuestionOptions.Dtos;
using Learning.Application.Models.Questions.Dtos;

namespace Learning.Application.Extensions;
public static class QuestionExtensions {
    public static QuestionDto ToQuestionDto(this Question question, ProblemDto? problem, List<QuestionOptionDto> questionOptions) {
        return new QuestionDto(
            Id: question.Id.Value,
            Content: question.Content,
            QuestionType: question.QuestionType.ToString(),
            QuestionLevel: question.QuestionLevel.ToString(),
            Mark: question.Mark,
            OrderIndex: question.OrderIndex,
            Problem: problem,
            QuestionOptions: questionOptions
        );
    }
    public static List<QuestionDto> ToListQuestionDto(this List<Question> questions) {
        var questionsDto = questions.Select(q => q.ToQuestionDto(null, q.QuestionOptions.ToListQuestionOptionDto())).ToList();
        return questionsDto;
    }
}

