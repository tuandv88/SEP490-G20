using BuildingBlocks.Caching;
using Learning.Domain.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Learning.Application.Models.Courses.EventHandlers;
public class CourseCancelScheduleEventHandler(ICacheService cacheService, IMessageScheduler scheduler, 
    ILogger<CourseCancelScheduleEventHandler> logger) : IConsumer<CourseCancelScheduleEvent> {
    public async Task Consume(ConsumeContext<CourseCancelScheduleEvent> context) {
        var course = context.Message.Course;
        var key = string.Format(RedisRepoKey.CourseTokenId, course.Id.Value);
        var tokeId = await cacheService.GetAsync(key);
        if(tokeId == null) {
            logger.LogWarning($"TokenId is not found with courseId: {course.Id.Value}");
            return;
        }
        await scheduler.CancelScheduledPublish(typeof(CourseScheduledEvent), Guid.Parse(tokeId));
    }
}

