namespace Learning.Application.Models.TestCases.Dtos;
public record TestCaseDetailsDto(
    Guid Id,
    Dictionary<string, string> Inputs,
    string ExpectedOutput,
    bool IsHidden,
    int OrderIndex
);
