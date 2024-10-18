namespace Learning.Domain.Models;
public class TestScript : Aggregate<TestScriptId> {
    private readonly List<TestCase> _testCases = new();
    public IReadOnlyList<TestCase> TestCases => _testCases.AsReadOnly();
    public ProblemId ProblemId { get; set; } = default!;
    public string FileName{ get; set; } = default!; // file name phải khớp với class trong solution dùng để compile
    public string Template { get; set; } = default!; // mẫu code hiển thị
    public string TestCode { get; set; } = default!;
    public string Description { get; set; } = default!;
    public LanguageCode LanguageCode { get; set; } = LanguageCode.Java; // loại ngôn ngữ code : java, c#, python,...

}

