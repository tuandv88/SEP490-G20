namespace Learning.Application.Models.TestCases.Dtos;
public record TestCaseDto(
    Dictionary<string, string> Inputs, // mỗi param là một dòng
    string ExpectedOutput
);

