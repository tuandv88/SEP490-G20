namespace Learning.Application.Models.QuestionOptions.Dtos;
public record QuestionOptionDto(
    Guid Id,
    string Content,
    int OrderIndex
);

