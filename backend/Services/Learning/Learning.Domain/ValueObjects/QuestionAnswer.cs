namespace Learning.Domain.ValueObjects;
public record QuestionAnswer {
    public string Id { get; set; }
    public string QuestionType {  get; set; }
    public int OrderIndex { get; set; }
    public string? Content { get; set; }
    public List<Choice>? Choices { get; set; }
    public List<string>? UserAnswers { get; set; } //là các ID ở trong choices
    public ProblemAnswer? Problem { get; set; }
};

public record Choice {
    public string Id { get; set; }
    public string Content { get; set; }
    public bool IsCorrect { get; set; }
    public int OrderIndex {  get; set; }
}


public record ProblemAnswer {
    public string Id { get; set; }
    public CodeAnswer? CodeAnswer { get; set; }
    public string? Token { get; set; }
    public string? RunTimeErrors { get; set; }
    public string? CompileErrors { get; set; }
    public double ExecutionTime { get; set; }
    public long MemoryUsage { get; set; }
    public List<TestResult>? TestResults { get; set; }
    public SubmissionStatus? Status { get; set; }
}

public record CodeAnswer {
    public string LanguageCode { get; set; }
    public string SolutionCode { get; set; }
}

