using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Submissions.Dtos;
public record BatchCodeExecuteDto(
    string LanguageCode,
    List<TestCaseDto> TestCases,
    List<string> SolutionCodes,
    string TestCode
);

