using Learning.Application.Models.ProblemSolutions.Dtos;

namespace Learning.Application.Models.TestScripts.Dtos;
public record CreateTestScriptDto(
    string FileName,
    string Template,
    string TestCode,
    string Description,
    string LanguageCode,
    List<CreateProblemSolutionDto> Solutions
);

