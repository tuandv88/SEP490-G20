namespace Learning.Application.Models.QuestionOptions.Dtos;
public record UpdateQuestionOptionDto(
    Guid? Id,
    string Content,
    int OrderIndex,
    bool IsCorrect
);

