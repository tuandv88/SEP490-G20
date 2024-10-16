namespace Course.Domain.Models;
public class ProblemSolution : Aggregate<ProblemSolutionId> {
    private readonly List<ProblemTestCase> _problemTestCases = new();
    public IReadOnlyList<ProblemTestCase> ProblemTestCases => _problemTestCases.AsReadOnly();
    public ProblemId ProblemId { get; set; } = default!;
    public string FileName{ get; set; } = default!; // file name phải khớp với class trong solution dùng để compile
    public string Template { get; set; } = default!; // mẫu code hiển thị
    public string SolutionCode { get; set; } = default!;
    public string Description { get; set; } = default!;
    public LanguageCode LanguageCode { get; set; } = LanguageCode.Java; // loại ngôn ngữ code : java, c#, python,...

}

