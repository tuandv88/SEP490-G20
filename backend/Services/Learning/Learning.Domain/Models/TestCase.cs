namespace Learning.Domain.Models;
public class TestCase : Entity<TestCaseId> {
    public ProblemId ProblemId { get; set; } = default!;
    public Dictionary<string, string> Inputs { get; set; } = new Dictionary<string, string>();
    public string ExpectedOutput { get; set; } = default!;
    public bool IsHidden { get; set; }
    public int OrderIndex { get; set; }

    public static TestCase Create(TestCaseId id, ProblemId problemId, Dictionary<string, string> inputs, string expectedOutput, bool isHidden, int orderIndex) {
        return new TestCase() {
            Id = id,
            ProblemId = problemId,
            Inputs = inputs,
            ExpectedOutput = expectedOutput,
            IsHidden = isHidden,
            OrderIndex = orderIndex,
        };
    }
}
