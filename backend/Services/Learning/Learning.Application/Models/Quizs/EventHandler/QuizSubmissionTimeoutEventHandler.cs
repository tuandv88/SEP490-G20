using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Events;
using MassTransit;

namespace Learning.Application.Models.Quizs.EventHandler;
public class QuizSubmissionTimeoutEventHandler(IQuizSubmissionRepository quizSubmissionRepository, IPublishEndpoint publishEndpoint) : IConsumer<QuizSubmissionTimeoutEvent> {
    public async Task Consume(ConsumeContext<QuizSubmissionTimeoutEvent> context) {
        var quizSubmissionId = context.Message.QuizSubmissionId;
        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(quizSubmissionId);
        if (quizSubmission == null) {
            throw new NotFoundException(nameof(QuizSubmission), quizSubmissionId);
        }
        if (quizSubmission.Status == QuizSubmissionStatus.InProgress) {
            quizSubmission.UpdateStatus(QuizSubmissionStatus.Processing);
            await quizSubmissionRepository.UpdateAsync(quizSubmission);

            await publishEndpoint.Publish(new QuizSubmissionEvent(quizSubmissionId));

            await quizSubmissionRepository.SaveChangesAsync();
        }
        return;
    }
}

