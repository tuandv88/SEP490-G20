using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.QuestionOptions.Dtos;

namespace Learning.Application.Models.Questions.Dtos;
public record CreateQuestionDto(
    bool IsActive,
    string Content,
    string QuestionType,
    string QuestionLevel,
    int Mark,
    CreateProblemDto? Problem,
    List<CreateQuestionOptionDto> QuestionOptions
);

