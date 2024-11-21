using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;

namespace Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
public class SubmissionQuizHandler(IQuizSubmissionRepository quizSubmissionRepository, IPublishEndpoint publishEndpoint,
    IUserContextService userContext) : ICommandHandler<SubmissionQuizCommand, SubmissionQuizResult> {
    public async Task<SubmissionQuizResult> Handle(SubmissionQuizCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;

        var quizSubmission = await quizSubmissionRepository.GetByIdAsync(request.QuizSubmissionId);
        if (quizSubmission == null) { 
            throw new NotFoundException(nameof(QuizSubmission), request.QuizSubmissionId);
        }
        quizSubmission.UpdateStatus(QuizSubmissionStatus.Processing);
        quizSubmission.SubmissionDate = DateTime.UtcNow;
        await  quizSubmissionRepository.UpdateAsync(quizSubmission);
        await publishEndpoint.Publish(new QuizSubmissionEvent(quizSubmission.Id.Value));
        await quizSubmissionRepository.SaveChangesAsync(cancellationToken);

        return new SubmissionQuizResult(quizSubmission.Status.ToString());
    }
}

