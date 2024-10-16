namespace Course.Domain.Models;
public class ProblemTestCase : Entity<ProblemTestCaseId> {
    public ProblemSolutionId ProblemSolutionId { get; set; } = default!;
    public string Input { get; set; } = default!;
    public string ExpectedOutput { get; set; } = default!;
}
