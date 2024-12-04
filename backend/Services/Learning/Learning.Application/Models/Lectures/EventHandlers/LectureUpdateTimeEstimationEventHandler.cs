using Learning.Domain.Events;
using MassTransit;

namespace Learning.Application.Models.Lectures.EventHandlers;
public class LectureUpdateTimeEstimationEventHandler(ICourseRepository courseRepository) : IConsumer<LectureUpdateTimeEstimationEvent>
{
    public async Task Consume(ConsumeContext<LectureUpdateTimeEstimationEvent> context)
    {
        var courseId = context.Message.CourseId;
        var course = await courseRepository.GetByIdDetailAsync(courseId.Value);
        if (course == null)
        {
            return;
        }
        var timeEstimation = course.Chapters.Sum(c => c.TimeEstimation);
        course.UpdateTimeEstimation(timeEstimation);

        await courseRepository.UpdateAsync(course);
        await courseRepository.SaveChangesAsync();
    }
}

