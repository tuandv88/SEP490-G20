using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Nodes;
using System.Text.Json;
using AI.Application.Common.Constants;

namespace AI.Application.Interfaces;
public interface IMessageContext {
    IDictionary<string, object?> Arguments { get; set; }
}
public class MessageContext  : IMessageContext{
    public IDictionary<string, object?> Arguments { get; set; } = new Dictionary<string, object?>();

    public MessageContext() { }

    public MessageContext(IDictionary<string, object?>? args) {
        Arguments = args ?? new Dictionary<string, object?>();
    }
}

public static class MessageContextExtensions {

    public static int GetCustomRagMaxTokensOrDefault(this IMessageContext? context, int defaultValue) {
        if (context.TryGetArg<int>(ContextConstant.Rag.MaxTokens, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static double GetCustomRagTemperatureOrDefault(this IMessageContext? context, double defaultValue) {
        if (context.TryGetArg<double>(ContextConstant.Rag.Temperature, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static double GetCustomRagNucleusSamplingOrDefault(this IMessageContext? context, double defaultValue) {
        if (context.TryGetArg<double>(ContextConstant.Rag.NucleusSampling, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static string GetCustomRagPromptOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Rag.Prompt, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static string GetCustomLearningLectureIdOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Learning.LectureId, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
   
    public static string GetCustomLearningProblemIdOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Learning.ProblemId, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static string GetCustomCommunityConnectionIdOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Community.ConnectionId, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static string GetCustomConnectionIdOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Community.ConnectionId, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }

    public static string GetCustomPathwayAnswersOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.Pathway.Answer, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static string GetCustomContentModerationOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.ContentModeration.Discussion, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }

    public static string GetCustomContentModerationImageUrlOrDefault(this IMessageContext? context, string defaultValue) {
        if (context.TryGetArg<string>(ContextConstant.ContentModeration.ImageUrl, out var customValue)) {
            return customValue;
        }

        return defaultValue;
    }
    public static bool TryGetArg<T>(this IMessageContext? context, string key, [NotNullWhen(true)] out T? value) {
        if (context != null && context.Arguments.TryGetValue(key, out object? x)) {
            if (x is JsonValue or JsonElement) {
                value = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(x));
            } else {
                value = (T?)x;
            }

            return value != null;
        }

        value = default;
        return false;
    }
}