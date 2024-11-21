
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
    public void Update(string title, string description, ProblemType problemType, DifficultyType difficultyType, float cpuTimeLimit, float cpuExtraTime,
        int memoryLimit, bool enableNetwork, int stackLimit, int maxThread, int maxFileSize, bool isActive) {
        Title = title;
        Description = description;
        ProblemType = problemType;
        DifficultyType = difficultyType;
        CpuTimeLimit = cpuTimeLimit;
        CpuExtraTime = cpuExtraTime;
        MemoryLimit = memoryLimit;
        EnableNetwork = enableNetwork;
        StackLimit = stackLimit;
        MaxThread = maxThread;
        MaxFileSize = maxFileSize;
        IsActive = isActive;
    }
    public void AddTestScript(params TestScript[] testScripts) {
        TestScripts.AddRange(testScripts);
    }
    public TestScript UpdateTestScript(TestScriptId testScriptId, string fileName, string template, string testCode, string description, LanguageCode languageCode) {
        var existingScript = TestScripts.FirstOrDefault(t => t.Id.Equals(testScriptId));

        if (existingScript == null) {
            throw new NotFoundException(nameof(TestScript), testScriptId.Value);
        }
        existingScript.FileName = fileName;
        existingScript.Template = template;
        existingScript.TestCode = testCode;
        existingScript.Description = description;
        existingScript.LanguageCode = languageCode;
        return existingScript;

    }

    public void RemoveTestScript(params TestScript[] testScripts) {
        var idsToRemove = testScripts.Select(ts => ts.Id).ToHashSet();
        TestScripts.RemoveAll(t => idsToRemove.Contains(t.Id));
    }

    public void AddProblemSolution(params ProblemSolution[] problemSolutions) {
        ProblemSolutions.AddRange(problemSolutions);
    }
    public ProblemSolution UpdateProblemSolution(ProblemSolutionId problemSolutionId, string fileName, string solutionCode, string description, LanguageCode languageCode, bool priority) {
        var existingProblemSolution = ProblemSolutions.FirstOrDefault(t => t.Id.Equals(problemSolutionId));

        if (existingProblemSolution == null) {
            throw new NotFoundException(nameof(ProblemSolution), problemSolutionId.Value);
        }
        existingProblemSolution.FileName = fileName;
        existingProblemSolution.SolutionCode = solutionCode;
        existingProblemSolution.Description = description;
        existingProblemSolution.LanguageCode = languageCode;
        existingProblemSolution.Priority = priority;
        return existingProblemSolution;

    }
    public void RemoveProblemSolution(params ProblemSolution[] problemSolutions) {
        var idsToRemove = problemSolutions.Select(ts => ts.Id).ToHashSet();
        ProblemSolutions.RemoveAll(t => idsToRemove.Contains(t.Id));
    }

    public void AddProblemSubmission(params ProblemSubmission[] problemSubmission) {
        ProblemSubmissions.AddRange(problemSubmission);
    }

    public void RemoveProblemSubmission(params ProblemSubmission[] problemSubmission) {
        var idsToRemove = problemSubmission.Select(ts => ts.Id).ToHashSet();
        ProblemSubmissions.RemoveAll(t => idsToRemove.Contains(t.Id));
    }

    public void AddTestCase(params TestCase[] testCases) {
        TestCases.AddRange(testCases);
    }
    public void RemoveTestCase(params TestCase[] testCases) {
        var idsToRemove = testCases.Select(ts => ts.Id).ToHashSet();
        TestCases.RemoveAll(t => idsToRemove.Contains(t.Id));
    }
    public TestCase UpdateTestCase(TestCaseId testCaseId, Dictionary<string, string> inputs, string expectedOutput, bool isHidden, int orderIndex) {
        var existingTestCase = TestCases.FirstOrDefault(t => t.Id.Equals(testCaseId));
        if (existingTestCase == null) {
            throw new NotFoundException(nameof(TestCase), testCaseId.Value);
        }
        existingTestCase.Inputs = inputs;
        existingTestCase.ExpectedOutput = expectedOutput;
        existingTestCase.IsHidden = isHidden;
        existingTestCase.OrderIndex = orderIndex;
        return existingTestCase;
    }

    public void ChangeActive() {
        IsActive = IsActive ? false : true;
    }
}

