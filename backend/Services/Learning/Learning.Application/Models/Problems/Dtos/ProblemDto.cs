using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Models.Problems.Dtos;
public record ProblemDto(
    Guid Id,
    string Title,
    string Description,
    float CpuTimeLimit,
    int MemoryLimit,
    Dictionary<string, string> Templates,
    List<TestCaseInputDto> TestCases
);

