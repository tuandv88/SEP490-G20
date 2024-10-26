using Learning.Application.Models.ProblemSolutions.Dtos;

namespace Learning.Application.Models.TestScripts.Dtos;
public record TestScriptDetailsDto(
    Guid Id,
    string FileName,
    string Template,
    string TestCode,
    string Description,
    string LanguageCode,
    List<ProblemSolutionDetailsDto> Solutions
);

