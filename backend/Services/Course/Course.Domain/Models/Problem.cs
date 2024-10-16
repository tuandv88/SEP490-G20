namespace Course.Domain.Models;
public class Problem : Aggregate<ProblemId> {
    private readonly List<ProblemSolution> _problemSolutions = new();
    public IReadOnlyList<ProblemSolution> ProblemSolutions => _problemSolutions.AsReadOnly();
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public ProblemType ProblemType { get; set; } = ProblemType.Practice;
    public DifficultyType DifficultyType { get; set; } = DifficultyType.Easy;
    public float CpuTimeLimit { get; set; } // giới hạn thời gian thực thi
    public float CpuExtraTime { get; set; } // Đợt thêm khoản bao lâu trước khi tắt
    public float MemoryLimit { get; set; } // giới hạn tài nguyên tiêu thụ
    public bool EnableNetwork { get; set; } // cho phép truy cập mạng không
    public int StackLimit {  get; set; } // giới hạn bộ nhớ stack
    public int MaxThread {  get; set; } //số thread có thể tạo ra
    public int MaxFileSize {  get; set; } // giới hạn kích thước file mà chương trình tạo ra 

}

