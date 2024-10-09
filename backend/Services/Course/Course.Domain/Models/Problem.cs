namespace Course.Domain.Models;
public class Problem : Aggregate<ProblemId> {
    private readonly List<ProblemSolution> _problemSolutions = new();
    public IReadOnlyList<ProblemSolution> ProblemSolutions => _problemSolutions.AsReadOnly();
    public LectureId LectureId { get; set; } = default!; // unique - mỗi bài chỉ có duy nhất một bài code thôi hoặc không thuộc về bài nào
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public ProblemType ProblemType { get; set; } = ProblemType.Practice;
    public DifficultyType DifficultyType { get; set; } = DifficultyType.Easy;
    public int TimeLimit { get; set; } // giới hạn thời gian thực thi
    public int MemoryLimit { get; set; } // giới hạn tài nguyên tiêu thụ

}

