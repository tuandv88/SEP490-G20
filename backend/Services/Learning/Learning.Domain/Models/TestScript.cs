namespace Learning.Domain.Models;
public class TestScript : Entity<TestScriptId> {
    public ProblemId ProblemId { get; set; } = default!;
    public string FileName { get; set; } = default!; // file name phải khớp với class trong solution dùng để compile
    public string Template { get; set; } = default!; // mẫu code hiển thị
    public string TestCode { get; set; } = default!;
    public string Description { get; set; } = default!;
    public LanguageCode LanguageCode { get; set; } = LanguageCode.Java; // loại ngôn ngữ code : java, c#, python,...

    public static TestScript Create(TestScriptId Id, ProblemId problemId, string fileName, string template, string testCode, string description, LanguageCode languageCode) {
        return new TestScript() {
            Id = Id,
            ProblemId = problemId,
            FileName = fileName,
            Template = template,
            TestCode = testCode,
            Description = description,
            LanguageCode = languageCode,
        };
    }
}

