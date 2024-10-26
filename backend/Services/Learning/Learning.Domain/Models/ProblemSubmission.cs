namespace Learning.Domain.Models;
public class ProblemSubmission : Entity<ProblemSubmissionId> {
    public UserId UserId { get; set; } = default!;
    public ProblemId ProblemId { get; set; } = default!;
    public DateTime SubmissionDate {  get; set; } = DateTime.UtcNow;
    public string SourceCode { get; set; } = default!;
    public LanguageCode LanguageCode { get; set; } = LanguageCode.Java;
    public double ExecutionTime { get; set; }// Tính bằng giây
    public long MemoryUsage {  get; set; } // tính bằng KB
    public List<TestResult> TestResults { get; set; } = new();
    public SubmissionStatus Status { get; set; } = default!;
    public string TokenReference { get; set; } = default!;
    public string? RunTimeErrors {  get; set; } = default!;
    public string? CompileErrors {  get; set; } = default!;

}

