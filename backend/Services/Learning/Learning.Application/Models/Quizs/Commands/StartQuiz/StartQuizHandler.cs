using Learning.Domain.Events;
using Learning.Domain.ValueObjects;
using MassTransit;

namespace Learning.Application.Models.Quizs.Commands.StartQuiz;
public class StartQuizHandler(IQuizSubmissionRepository quizSubmissionRepository, IQuizRepository quizRepository, 
     IUserContextService userContext, IMessageScheduler scheduler) : ICommandHandler<StartQuizCommand, StartQuizResult> {
    public async Task<StartQuizResult> Handle(StartQuizCommand request, CancellationToken cancellationToken) {
        var userId = userContext.User.Id;
        var quiz = await quizRepository.GetByIdAsync(request.QuizId);

        if (quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }

        if (!quiz.IsActive) {
            throw new InvalidOperationException("Quiz is not active.");
        }

        // Nếu quiz không có giới hạn số lần làm bài, bỏ qua kiểm tra số lần làm
        if (quiz.HasAttemptLimit) {
            var attemptCount = await quizSubmissionRepository.CountByQuizAndUser(request.QuizId, userId);
            if (attemptCount >= quiz.AttemptLimit) {
                throw new InvalidOperationException("You have reached the attempt limit for this quiz.");
            }
        }
        //Kiểm tra xem đã có bài nào chưa nộp hay không chưa ?
        var previousSubmission = await quizSubmissionRepository.GetSubmissionInProgressAsync(request.QuizId, userId);
        if (previousSubmission != null && previousSubmission.Status == QuizSubmissionStatus.InProgress) {
            return new StartQuizResult(previousSubmission.Id.Value);
        }
        

        // Tạo submission bắt đầu làm quiz
        var quizSubmission = new QuizSubmission {
            Id = QuizSubmissionId.Of(Guid.NewGuid()),
            UserId = UserId.Of(userId),
            QuizId = quiz.Id,
            StartTime = DateTime.UtcNow,
            Status = QuizSubmissionStatus.InProgress // Bắt đầu làm bài
        };

        if (quiz.HasTimeLimit) {
            // sau giới hạn thời gian tự động nộp bài quiz ( có độ trễ khi lưu nên tăng thêm ít thời gian)
            await scheduler.SchedulePublish(DateTime.UtcNow.AddMinutes(quiz.TimeLimit + 0.1), new QuizSubmissionTimeoutEvent(quizSubmission.Id.Value), cancellationToken);
            //await ScheduleTimeLimit(quizSubmission.Id, DateTime.UtcNow.AddMinutes(quiz.TimeLimit));
        }
        await quizSubmissionRepository.AddAsync(quizSubmission);
        await quizSubmissionRepository.SaveChangesAsync(cancellationToken);

        return new StartQuizResult(quizSubmission.Id.Value);
    }

    private async Task ScheduleTimeLimit(QuizSubmissionId quizSubmissionId, DateTime time) {
        await scheduler.SchedulePublish(time, new QuizSubmissionTimeoutEvent(quizSubmissionId.Value));
    }
}

