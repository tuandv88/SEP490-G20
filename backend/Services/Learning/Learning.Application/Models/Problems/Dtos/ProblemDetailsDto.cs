using Learning.Application.Models.TestCases.Dtos;
using Learning.Application.Models.TestScripts.Dtos;

namespace Learning.Application.Models.Problems.Dtos;
public record ProblemDetailsDto(
    Guid Id,
    string Title,
    string Description,
    string ProblemType,
    string DifficultyType,
    float CpuTimeLimit,
    float CpuExtraTime,
    int MemoryLimit,
    bool EnableNetwork,
    int StackLimit,
    int MaxThread,
    int MaxFileSize,
    bool IsActive,
    List<TestScriptDetailsDto> TestScrips,
    List<TestCaseDetailsDto> TestCases
);

