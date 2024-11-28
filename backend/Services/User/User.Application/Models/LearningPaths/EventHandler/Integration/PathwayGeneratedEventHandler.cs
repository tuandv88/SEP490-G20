using BuildingBlocks.Messaging.Events.AIs;
using MassTransit;
using Microsoft.Extensions.Logging;
using User.Application.Data.Repositories;
using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Application.Models.LearningPaths.EventHandler.Integration;
public class PathwayGeneratedEventHandler(ILearningPathRepository pathRepository, IPathStepsRepository pathStepsRepository,
    ILogger<PathwayGeneratedEventHandler> logger) : IConsumer<PathwayGeneratedEvent> {
    public async Task Consume(ConsumeContext<PathwayGeneratedEvent> context) {
        var @event = context.Message;
        var existLearningPath = await pathRepository.GetByUserIdAsync(@event.UserId);
        if (existLearningPath != null) {
            logger.LogDebug($"Exist learning path of user: {@event.UserId}");
            return;
        }
        var learningPath = LearningPath.Create(
                LearningPathId.Of(Guid.NewGuid()),
                UserId.Of(@event.UserId),
                @event.PathwayName,
                DateTime.UtcNow,
                DateTime.UtcNow + @event.EstimatedCompletionTime,
                LearningPathStatus.NotStarted,
                @event.Reason
            );

        var listPathSteps = new List<PathStep>();
        int step = 1;
        DateTime now = DateTime.UtcNow;
        foreach (var pathStep in @event.PathSteps) {
            now = now + pathStep.EstimatedCompletionTime;
            var newPathStep = PathStep.Create(
                    learningPath.Id,
                    CourseId.Of(pathStep.CourseId),
                    step,
                    PathStepStatus.NotStarted,
                    null,
                    now
                );
            listPathSteps.Add(newPathStep);
            await pathStepsRepository.AddAsync(newPathStep);
            step++;
        }
        learningPath.AddPathSteps(listPathSteps);
        await pathStepsRepository.SaveChangesAsync();
    }
}

