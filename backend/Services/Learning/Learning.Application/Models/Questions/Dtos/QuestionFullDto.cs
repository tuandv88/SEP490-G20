using Learning.Application.Models.QuestionOptions.Dtos;

namespace Learning.Application.Models.Questions.Dtos;
public record QuestionFullDto(
    Guid Id,
    bool IsActive,
    string Content,
    string QuestionType,
    string QuestionLevel,
    int Mark,
    int OrderIndex,
    Guid? ProblemId,
    List<QuestionOptionFullDto> QuestionOptions
);

