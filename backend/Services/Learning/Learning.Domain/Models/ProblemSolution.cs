namespace Learning.Domain.Models;
public class ProblemSolution : Entity<ProblemSolutionId> {
    public ProblemId ProblemId { get; set; } = default!;
    public string FileName { get; set; } = default!; // file name phải khớp với class trong solution dùng để compile
    public string SolutionCode { get; set; } = default!;
    public string Description { get; set; } = default!;
    public LanguageCode LanguageCode { get; set; } = LanguageCode.Java; // loại ngôn ngữ code : java, c#, python,...
    public bool Priority = false;

    public static ProblemSolution Create(ProblemSolutionId id, ProblemId problemId, string fileName, string solutionCode, string description, LanguageCode languageCode, bool priority) {
        return new ProblemSolution() {
            Id = id,
            ProblemId = problemId,
            FileName = fileName,
            SolutionCode = solutionCode,
            Description = description,
            LanguageCode = languageCode,
            Priority = priority,
        };
    }
}

