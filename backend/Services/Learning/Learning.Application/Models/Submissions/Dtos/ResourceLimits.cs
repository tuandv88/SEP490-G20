namespace Learning.Application.Models.Submissions.Dtos;
public record ResourceLimits(
    float CpuTimeLimit,
    float CpuExtraTime,
    int MemoryLimit,
    bool EnableNetwork,
    int StackLimit,
    int MaxThread,
    int MaxFileSize
);

