using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Submissions.Dtos;
public record CreateCodeExecuteDto(
     string LanguageCode,
     string SolutionCode,
     List<TestCaseInputDto> TestCases
);

