using Learning.Domain.Events;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureUpdateTimeEstimationEventHandler(ICourseRepository courseRepository) : INotificationHandler<LectureUpdateTimeEstimationEvent> {

    public async Task Handle(LectureUpdateTimeEstimationEvent notification, CancellationToken cancellationToken) {
        var courseId = notification.CourseId;
        var course = await courseRepository.GetByIdDetailAsync(courseId.Value);
        if (course == null) {
            return;
        }
        var timeEstimation = course.Chapters.Sum(c => c.TimeEstimation);
        course.UpdateTimeEstimation(timeEstimation);

        await courseRepository.UpdateAsync(course);
    }
}

