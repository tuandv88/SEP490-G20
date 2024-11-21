using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.QuestionOptions.Dtos;

namespace Learning.Application.Models.Questions.Dtos;
public record UpdateQuestionDto(
    bool IsActive,
    string Content,
    string QuestionType,
    string QuestionLevel,
    int Mark,
    Guid? ProblemId,
    UpdateProblemDto? Problem,
    List<UpdateQuestionOptionDto> QuestionOptions
);