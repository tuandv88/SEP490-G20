namespace Learning.Domain.ValueObjects;
public record TestResult(
    Dictionary<string, string>? Inputs,
    string? Output,
    string? Stdout,
    string? Expected,
    bool IsPass
);

