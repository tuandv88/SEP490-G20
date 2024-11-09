using Learning.Application.Models.TestScripts.Dtos;

namespace Learning.Application.Extensions;
public static class TestScriptExtensions {
    public static TestScriptDetailsDto ToTestScriptDetailsDto(this TestScript testScript, List<ProblemSolution> solutions) {
        return new TestScriptDetailsDto(
            Id: testScript.Id.Value,
            Template: testScript.Template,
            FileName: testScript.FileName,
            TestCode: testScript.TestCode,
            Description: testScript.Description,
            LanguageCode: testScript.LanguageCode.ToString(),
            Solutions: solutions.ToListProblemSolutionDetailsDto()
            );
    }
}

