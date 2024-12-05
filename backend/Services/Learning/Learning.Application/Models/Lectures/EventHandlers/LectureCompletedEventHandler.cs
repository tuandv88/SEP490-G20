using BuildingBlocks.Messaging.Events.Learnings;
using Learning.Domain.Events;
using MassTransit;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureCompletedEventHandler(IPublishEndpoint publishEndpoint, IUserEnrollmentRepository userEnrollmentRepository, ILectureRepository lectureRepository) : INotificationHandler<LectureCompletedEvent> {
    public async Task Handle(LectureCompletedEvent notification, CancellationToken cancellationToken) {
        var lecture = await lectureRepository.GetByIdAsync(notification.LectureProgress.LectureId.Value);
        var userEnrollment = await userEnrollmentRepository.GetByIdAsync(notification.LectureProgress.UserEnrollmentId.Value);
        if (lecture == null || userEnrollment == null) {
            return;
        }
        await publishEndpoint.Publish(new RewardPointsGrantedEvent(userEnrollment.UserId.Value, lecture.Point,
            $"Bonus points for completing lessons {lecture.Title} with lectureId: {lecture.Id.Value}"));

    }
}

