
using Microsoft.KernelMemory.Prompts;

namespace AI.Infrastructure.Services;
public class MessageService(IPromptProvider promptProvider) : IMessageService {
    public string BuildPrompt(PromptType promptType, string question, string facts, IMessageContext? context = default) {
        return promptType switch {
            PromptType.AnswerWithFacts => BuidAnswerWithFacts(question, facts, context),
            PromptType.Suggestion => BuildSuggestion(question, facts),
            PromptType.Summarize => BuildSummarize(question, facts),
            PromptType.Pathway => BuildPathway(question, facts, context),
            PromptType.ContentModeration => BuildContentModeration(question, facts, context),
            _ => throw new ArgumentOutOfRangeException(nameof(promptType), promptType, null)
        };
    }



    public string ExtractMessage(PromptType promptType, string message) {
        return promptType switch {
            PromptType.AnswerWithFacts => ExtractAnswerMessage(message),
            PromptType.Suggestion => ExtractSuggestionMessage(message),
            PromptType.Summarize => ExtractSummaryMessage(message),
            PromptType.Pathway => ExtractPathwayMessage(message),
            PromptType.ContentModeration => ExtractContentModeration(message),
            _ => throw new ArgumentOutOfRangeException(nameof(promptType), promptType, null)
        };
    }


    private string BuidAnswerWithFacts(string question, string facts, IMessageContext? context) {
        var prompt = promptProvider.ReadPrompt(PromptType.AnswerWithFacts.ToStringValue());
        var lectureId = context.GetCustomLearningLectureIdOrDefault("");
        var problemId = context.GetCustomLearningProblemIdOrDefault("");
        var connectionId = context.GetCustomCommunityConnectionIdOrDefault("");
        var fullname = context.GetCustomUserFullnameOrDefault("");
        
        prompt = prompt.Replace("{{$facts}}", facts.Trim(), StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$lectureId}}", lectureId, StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$problemId}}", problemId, StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$connectionId}}", connectionId, StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$fullname}}", fullname, StringComparison.OrdinalIgnoreCase);

        question = question.Trim();
        question = question.EndsWith('?') ? question : $"{question}?";
        prompt = prompt.Replace("{{$input}}", question, StringComparison.OrdinalIgnoreCase);
        return prompt;
    }
    private string BuildSuggestion(string question, string facts) {
        throw new NotImplementedException();
    }
    private string BuildSummarize(string question, string facts) {
        throw new NotImplementedException();
    }

    private string BuildPathway(string question, string facts, IMessageContext? context) {
        var prompt = promptProvider.ReadPrompt(PromptType.Pathway.ToStringValue());
        var answers = context.GetCustomPathwayAnswersOrDefault("");

        prompt = prompt.Replace("{{$course}}", facts.Trim(), StringComparison.OrdinalIgnoreCase);
        prompt = prompt.Replace("{{$assessment}}", answers.Trim(), StringComparison.OrdinalIgnoreCase);
        return prompt;
    }
    private string BuildContentModeration(string question, string facts, IMessageContext? context) {
        var prompt = promptProvider.ReadPrompt(PromptType.ContentModeration.ToStringValue());
        var answers = context.GetCustomContentModerationOrDefault("");

        prompt = prompt.Replace("{{discussion}}", facts.Trim(), StringComparison.OrdinalIgnoreCase);

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
    private string ExtractContentModeration(string message) {
        throw new NotImplementedException();
    }

}

