using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Learning.Application.Models.Quizs.EventHandler;
public class QuizSubmissionTimeoutEventHandler(IQuizSubmissionRepository quizSubmissionRepository, IPublishEndpoint publishEndpoint, 
    ILogger<QuizSubmissionTimeoutEventHandler> logger) : IConsumer<QuizSubmissionTimeoutEvent>
{
    public async Task Consume(ConsumeContext<QuizSubmissionTimeoutEvent> context)
    {
        var quizSubmissionId = context.Message.QuizSubmissionId;
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(quizSubmissionId);
        if (quizSubmission == null)
        {
            throw new NotFoundException(nameof(QuizSubmission), quizSubmissionId);
        }
        if (quizSubmission.Status == QuizSubmissionStatus.InProgress)
        {
            quizSubmission.UpdateStatus(QuizSubmissionStatus.Processing);
            quizSubmission.SubmissionDate = DateTime.UtcNow;
            await quizSubmissionRepository.UpdateAsync(quizSubmission);
            logger.LogInformation($"Published event QuizSubmissionEvent :{quizSubmissionId}");
            await quizSubmissionRepository.SaveChangesAsync();
            await publishEndpoint.Publish(new QuizSubmissionEvent(quizSubmissionId));
        }
    }
}

