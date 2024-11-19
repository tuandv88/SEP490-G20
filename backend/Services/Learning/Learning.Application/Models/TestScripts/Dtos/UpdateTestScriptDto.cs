using Learning.Application.Models.ProblemSolutions.Dtos;

namespace Learning.Application.Models.TestScripts.Dtos;
public record UpdateTestScriptDto(
    Guid? Id,
    string FileName,
    string Template,
    string TestCode,
    string Description,
    string LanguageCode,
    List<UpdateProblemSolutionDto> ProlemSolutions
);

