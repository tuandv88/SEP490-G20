namespace AI.Domain.Enums;
public enum PromptType {
    AnswerWithFacts,
    Suggestion,
    Summarize
}

public static class PromptTypeExtensions {
    private static readonly Dictionary<PromptType, string> _enumToStringMap = new Dictionary<PromptType, string>
    {
        { PromptType.AnswerWithFacts, "answer-with-facts" },
        { PromptType.Suggestion, "suggestion" },
        { PromptType.Summarize, "summarize" }
    };

    public static string ToStringValue(this PromptType promptType) {
        if (_enumToStringMap.TryGetValue(promptType, out var stringValue)) {
            return stringValue;
        }
        throw new ArgumentException("Invalid PromptType value", nameof(promptType));
    }
}