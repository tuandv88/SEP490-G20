using Learning.Domain.Events;
using MassTransit;
namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseScheduledEventHandler(ICourseRepository courseRepository) : IConsumer<CourseScheduledEvent> {
    public async Task Consume(ConsumeContext<CourseScheduledEvent> context) {
        var courseId = context.Message.CourseId;
        var course = await courseRepository.GetByIdAsync(courseId);
        if(course == null) {
            return;
        }
        course.UpdateStatus(CourseStatus.Published);
        await courseRepository.UpdateAsync(course);
        await courseRepository.SaveChangesAsync();
    }
}

