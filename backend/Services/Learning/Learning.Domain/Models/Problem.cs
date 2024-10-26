
using Learning.Domain.ValueObjects;

namespace Learning.Domain.Models;
public class Problem : Aggregate<ProblemId> {
    public List<TestScript> TestScripts = new();
    public List<ProblemSolution> ProblemSolutions = new();
    public List<ProblemSubmission> ProblemSubmissions = new();
    public List<TestCase> TestCases = new();
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public ProblemType ProblemType { get; set; } = ProblemType.Practice;
    public DifficultyType DifficultyType { get; set; } = DifficultyType.Easy;
    public float CpuTimeLimit { get; set; } // giới hạn thời gian thực thi
    public float CpuExtraTime { get; set; } // Đợt thêm khoản bao lâu trước khi tắt
    public int MemoryLimit { get; set; } // giới hạn tài nguyên tiêu thụ
    public bool EnableNetwork { get; set; } // cho phép truy cập mạng không
    public int StackLimit { get; set; } // giới hạn bộ nhớ stack
    public int MaxThread { get; set; } //số thread có thể tạo ra
    public int MaxFileSize { get; set; } // giới hạn kích thước file mà chương trình tạo ra 
    public bool IsActive { get; set; } = true;

    public static Problem Create(ProblemId problemId, string title, string description, ProblemType problemType, DifficultyType difficultyType, float cpuTimeLimit, float cpuExtraTime, 
        int memoryLimit, bool enableNetwork, int stackLimit, int maxThread, int maxFileSize, bool isActive) {
        var problem = new Problem() {
            Id = problemId,
            Title = title,
            Description = description,
            ProblemType = problemType,
            DifficultyType = difficultyType,
            CpuTimeLimit = cpuTimeLimit,
            CpuExtraTime = cpuExtraTime,
            MemoryLimit = memoryLimit,
            EnableNetwork = enableNetwork,
            StackLimit = stackLimit,
            MaxThread = maxThread,
            MaxFileSize = maxFileSize,
            IsActive = isActive,
        };
        return problem;

    }
    public void AddTestScript(TestScript testScript) {
        TestScripts.Add(testScript);
    }
    public void AddTestScript(List<TestScript> testScripts) {
        TestScripts.AddRange(testScripts);
    }
    public void RemoveTestScript(TestScript testScript) {
        TestScripts.Remove(testScript);
    }

    public void AddProblemSolution(ProblemSolution problemSolution) {
        ProblemSolutions.Add(problemSolution);
    }
    public void AddProblemSolution(List<ProblemSolution> problemSolutions) {
        ProblemSolutions.AddRange(problemSolutions);
    }
    public void RemoveProblemSolution(ProblemSolution problemSolution) {
        ProblemSolutions.Remove(problemSolution);
    }

    public void AddProblemSubmission(ProblemSubmission problemSubmission) {
        ProblemSubmissions.Add(problemSubmission);
    }

    public void RemoveProblemSubmission(ProblemSubmission problemSubmission) {
        ProblemSubmissions.Remove(problemSubmission);
    }

    public void AddTestCase(TestCase testCase) {
        TestCases.Add(testCase);
    }
    public void AddTestCase(List<TestCase> testCases) {
        TestCases.AddRange(testCases);
    }
    public void RemoveTestCase(TestCase testCase) {
        TestCases.Remove(testCase);
    }

    
}

