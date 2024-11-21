namespace Learning.Application.Commons;
public static class ConfigurationResourceLimits {
    // CPU Time Limits
    public const float MinCpuTimeLimit = 0.1f;
    public const float MaxCpuTimeLimit = 20.0f;

    // Extra CPU Time
    public const float MinCpuExtraTime = 0.0f;
    public const float MaxCpuExtraTime = 5.0f;

    // Memory Limits (in KB)
    public const int MinMemoryLimit = 50 * 1024;
    public const int MaxMemoryLimit = 500 * 1024;

    // Stack Limits (in KB)
    public const int MinStackLimit = 30 * 1024;
    public const int MaxStackLimit = 500 * 1024;

    // Thread Limits
    public const int MinThreads = 20;
    public const int MaxThreads = 120;

    // File Size Limits (in KB)
    public const int MinFileSize = 1 * 1024;
    public const int MaxFileSize = 20 * 1024;

    // Network Configuration
    public const bool EnableNetwork = false;
}
