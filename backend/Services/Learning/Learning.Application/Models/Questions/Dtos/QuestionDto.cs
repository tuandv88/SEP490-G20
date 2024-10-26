using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.QuestionOptions.Dtos;

namespace Learning.Application.Models.Questions.Dtos;
public record QuestionDto(
    Guid Id,
    string Content,
    string QuestionType,
    string QuestionLevel,
    int Mark,
    int OrderIndex,
    ProblemDto? Problem,
    List<QuestionOptionDto> QuestionOptions
);

