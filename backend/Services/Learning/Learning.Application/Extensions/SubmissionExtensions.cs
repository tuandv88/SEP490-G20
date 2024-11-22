using Learning.Application.Models.Submissions.Dtos;

namespace Learning.Application.Extensions;
public static class SubmissionExtensions {
    public static List<CodeExecuteDto> ToCodeExecuteDto(this List<SubmissionResponse> Submissions, string LanguageCode) {
        return Submissions.Select(s => new CodeExecuteDto(
                Token: s.Token,
                RunTimeErrors: s.Stderr,
                CompileErrors: s.CompileOutput,
                ExecutionTime: double.TryParse(s.Time, out var time) ? time : 0.0,
                MemoryUsage: s.Memory.HasValue ? (long)s.Memory.Value : 0L,
                TestResults: DeserializeObjectToTestResult(s.Stdout),
                Status: new SubmissionStatus(s.Status!.Id, s.Status.Description),
                LanguageCode: s.LanguageId.HasValue ? ((LanguageCode)s.LanguageId.Value).ToString() : LanguageCode
            )).ToList();
    }
    private static List<TestResult> DeserializeObjectToTestResult(string? output) {
        if (output == null) return new List<TestResult>();
        try {
            List<TestResult> testResults = JsonConvert.DeserializeObject<List<TestResult>>(output.Trim())!;
            return testResults;
        } catch (Exception) {
            return new List<TestResult>() {
                new TestResult(Inputs: new(), Output: "", Stdout: output!, Expected: "", IsPass: false) };
        }
    }
    public static SubmissionLectureViewDto ToSubmissionLectureViewDto(this ProblemSubmission submission) {
        return new SubmissionLectureViewDto(
                submission.SubmissionDate,
                submission.LanguageCode.ToString(),
                submission.TestResults.Count,
                submission.TestResults.Count(t => t.IsPass),
                submission.ExecutionTime,
                submission.MemoryUsage,
                submission.RunTimeErrors,
                submission.CompileErrors
                );
    }
}