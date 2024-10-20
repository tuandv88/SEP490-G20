namespace Learning.Domain.Models;
public class TestCase : Entity<TestCaseId> {
    public TestScriptId TestScriptId { get; set; } = default!;
    public string Input { get; set; } = default!;
    public string ExpectedOutput { get; set; } = default!;
    public bool IsHidden {  get; set; }
    public int OrderIndex {  get; set; }
}
