namespace Learning.Application.Models.TestCases.Dtos;
public record CreateTestCaseDto(
    Dictionary<string, string> Inputs,
    string ExpectedOutput,
    bool IsHidden,
    int OrderIndex
);

