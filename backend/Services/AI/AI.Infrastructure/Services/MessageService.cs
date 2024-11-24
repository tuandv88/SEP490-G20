
using Microsoft.KernelMemory.Prompts;

namespace AI.Infrastructure.Services;
public class MessageService(IPromptProvider promptProvider) : IMessageService {
    public string BuildPrompt(PromptType promptType, string question, string facts, IMessageContext? context = default) {
        return promptType switch {
            PromptType.AnswerWithFacts => BuidAnswerWithFacts(question, facts, context),
            PromptType.Suggestion => BuidSuggestion(question, facts),
            PromptType.Summarize => BuidSummarize(question, facts),
            PromptType.Pathway => BuidPathway(question, facts, context),
            _ => throw new ArgumentOutOfRangeException(nameof(promptType), promptType, null)
        };
    }

    public string ExtractMessage(PromptType promptType, string message) {
        return promptType switch {
            PromptType.AnswerWithFacts => ExtractAnswerMessage(message),
            PromptType.Suggestion => ExtractSuggestionMessage(message),
            PromptType.Summarize => ExtractSummaryMessage(message),
            PromptType.Pathway => ExtractPathwayMessage(message),
            _ => throw new ArgumentOutOfRangeException(nameof(promptType), promptType, null)
        };
    }

    private string BuidAnswerWithFacts(string question, string facts, IMessageContext? context) {
        var prompt = promptProvider.ReadPrompt(PromptType.AnswerWithFacts.ToStringValue());
        var lectureId = context.GetCustomLearningLectureIdOrDefault("");
        var problemId = context.GetCustomLearningProblemIdOrDefault("");
        var connectionId = context.GetCustomCommunityConnectionIdOrDefault("");

        prompt = prompt.Replace("{{$facts}}", facts.Trim(), StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$lectureId}}", lectureId, StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$problemId}}", problemId, StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$connectionId}}", connectionId, StringComparison.OrdinalIgnoreCase);


        question = question.Trim();
        question = question.EndsWith('?') ? question : $"{question}?";
        prompt = prompt.Replace("{{$input}}", question, StringComparison.OrdinalIgnoreCase);
        return prompt;
    }
    private string BuidSuggestion(string question, string facts) {
        throw new NotImplementedException();
    }
    private string BuidSummarize(string question, string facts) {
        throw new NotImplementedException();
    }

    private string BuidPathway(string question, string facts, IMessageContext? context) {
        var prompt = promptProvider.ReadPrompt(PromptType.Pathway.ToStringValue());
        var answers = context.GetCustomPathwayAnswersOrDefault("");

        prompt = prompt.Replace("{{$facts}}", facts.Trim(), StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{answers}}", answers.Trim(), StringComparison.OrdinalIgnoreCase);
        return prompt;
    }

    private string ExtractAnswerMessage(string message) {

        return "Extracted Answer Message";
    }

    private string ExtractSuggestionMessage(string message) {

        throw new NotImplementedException();
    }

    private string ExtractSummaryMessage(string message) {

        throw new NotImplementedException();
    }
    private string ExtractPathwayMessage(string message) {
        throw new NotImplementedException();
    }

}

