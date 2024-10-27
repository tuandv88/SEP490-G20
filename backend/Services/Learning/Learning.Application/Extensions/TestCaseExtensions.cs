using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Extensions;
public static class TestCaseExtensions {
    public static TestCaseDetailsDto ToTestCaseDetailsDto(this TestCase testCase) {
        return new TestCaseDetailsDto(
                Id: testCase.Id.Value,
                Inputs: testCase.Inputs,
                ExpectedOutput: testCase.ExpectedOutput,
                IsHidden: testCase.IsHidden,
                OrderIndex: testCase.OrderIndex
            );
    }
    public static List<TestCaseDetailsDto> ToListTestCaseDetailsDto(this List<TestCase> testCases) {
        return testCases.Select(t => t.ToTestCaseDetailsDto()).ToList();
    }
}