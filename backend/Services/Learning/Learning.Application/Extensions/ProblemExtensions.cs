using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Extensions;
public static class ProblemExtensions {
    public static ProblemDto ToProblemDto(this Problem problem) {
        var problemDto = new ProblemDto(
            Id: problem.Id.Value,
            Title: problem.Title,
            Description: problem.Description,
            CpuTimeLimit: problem.CpuTimeLimit,
            MemoryLimit: problem.MemoryLimit,
            Templates: MapToTemplates(problem.TestScripts),
            TestCases: problem.TestCases.Select(t => new TestCaseInputDto(t.Inputs)).ToList()
            );
        return problemDto;
    }
    private static Dictionary<string, string> MapToTemplates (List<TestScript> testScripts) {
        Dictionary<string, string> templates = new Dictionary<string, string> ();
        foreach( var testScript in testScripts ) {
            var languageCode = testScript.LanguageCode.ToString();
            templates.Add(languageCode, testScript.Template);
        }
        return templates;
    }
}

