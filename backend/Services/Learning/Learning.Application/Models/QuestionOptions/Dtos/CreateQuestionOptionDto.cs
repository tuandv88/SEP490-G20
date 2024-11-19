namespace Learning.Application.Models.QuestionOptions.Dtos;
public record CreateQuestionOptionDto(
    string Content,
    bool IsCorrect,
    int OrderIndex
);
