namespace Learning.Application.Models.TestCases.Dtos;
public record UpdateTestCaseDto(
     Guid? Id,
     Dictionary<string, string> Inputs,
     string ExpectedOutput,
     bool IsHidden,
     int OrderIndex
);
