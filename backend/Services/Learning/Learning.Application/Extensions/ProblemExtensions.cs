using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.TestCases.Dtos;

namespace Learning.Application.Extensions;
public static class ProblemExtensions {
    public static ProblemDto ToProblemDto(this Problem problem, bool? hiddenTestCase) {
        var testCases = problem.TestCases
           .Where(t => hiddenTestCase == null || t.IsHidden == hiddenTestCase.Value)
           .Select(t => new TestCaseInputDto(t.Inputs))
           .ToList();
        var problemDto = new ProblemDto(
            Id: problem.Id.Value,
            Title: problem.Title,
            Description: problem.Description,
            CpuTimeLimit: problem.CpuTimeLimit,
            MemoryLimit: problem.MemoryLimit,
            Templates: MapToTemplates(problem.TestScripts),
            TestCases: testCases
            );
        return problemDto;
    }
    private static Dictionary<string, string> MapToTemplates(List<TestScript> testScripts) {
        Dictionary<string, string> templates = new Dictionary<string, string>();
        foreach (var testScript in testScripts) {
            var languageCode = testScript.LanguageCode.ToString();
            templates.Add(languageCode, testScript.Template);
        }
        return templates;
    }
    public static ProblemDetailsDto ToProblemDetailsDto(this Problem problem) {
        var problemDetailsDto = new ProblemDetailsDto(
            Id: problem.Id.Value,
            Title: problem.Title,
            Description: problem.Description,
            ProblemType: problem.ProblemType.ToString(),
            DifficultyType: problem.DifficultyType.ToString(),
            CpuTimeLimit: problem.CpuTimeLimit,
            CpuExtraTime: problem.CpuExtraTime,
            MemoryLimit: problem.MemoryLimit,
            EnableNetwork: problem.EnableNetwork,
            StackLimit: problem.StackLimit,
            MaxThread: problem.MaxThread,
            MaxFileSize: problem.MaxFileSize,
            IsActive: problem.IsActive,
            TestScrips: problem.TestScripts.Select(t => {
                var solutions = problem.ProblemSolutions.Where(p => t.LanguageCode.Equals(p.LanguageCode)).ToList();
                return t.ToTestScriptDetailsDto(solutions);
            }).ToList(),
            TestCases: problem.TestCases.ToListTestCaseDetailsDto()
            );
        return problemDetailsDto;
    }

    public static ProblemListDto ToProblemListDto(this Problem problem, Guid? userid) {
        string status = ProblemListStatus.TODO;

        var problemSubmisstionOfUser = problem.ProblemSubmissions
            .Where(pl => pl.UserId.Value == userid)
            .ToList();

        if (problemSubmisstionOfUser.Any()) {
            if (problemSubmisstionOfUser.Any(submission =>
                submission.TestResults.All(test => test.IsPass))) {
                status = ProblemListStatus.SOLVED;
            } else {
                status = ProblemListStatus.ATTEMPTED;
            }
        }

        float acceptance = -1f;

        int totalSubmissions = problem.ProblemSubmissions.Count;
        int passedSubmissions = problem.ProblemSubmissions
            .Count(submission => submission.TestResults.All(test => test.IsPass));

        if (totalSubmissions > 0) {
            acceptance = (float)passedSubmissions / totalSubmissions;
        }

        var problemListDto = new ProblemListDto(
            ProblemsId: problem.Id.Value,
            Status: status,
            Title: problem.Title,
            Difficulty: problem.DifficultyType.ToString(),
            Acceptance: acceptance
            );
        return problemListDto;
    }
}

