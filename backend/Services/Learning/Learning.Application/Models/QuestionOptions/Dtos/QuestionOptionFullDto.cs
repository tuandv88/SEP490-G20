namespace Learning.Application.Models.QuestionOptions.Dtos;
public record QuestionOptionFullDto(
    Guid Id,
    string Content,
    int OrderIndex,
    bool IsCorrect
);

