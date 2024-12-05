using BuildingBlocks.Messaging.Events.Learnings;
using MassTransit;
using User.Application.Data.Repositories;
using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Application.Models.PointHistories.EnventHandlers.Integrations;
public class RewardPointsGrantedEventHandler(IPointHistoryRepository pointHistoryRepository) : IConsumer<RewardPointsGrantedEvent> {
    public async Task Consume(ConsumeContext<RewardPointsGrantedEvent> context) {
        var message = context.Message;
        var pointHistory = CreateNewPointHistory(message.Point, message.UserId, message.Source);

        await pointHistoryRepository.AddAsync(pointHistory);
        await pointHistoryRepository.SaveChangesAsync();
    }

    public PointHistory CreateNewPointHistory(long point, Guid userId, string source) {
        return PointHistory.Create(
            PointHistoryId.Of(Guid.NewGuid()),
            UserId.Of(userId),
            point,
            ChangeType.Earned,
            source,
            DateTime.UtcNow,
            DateTime.UtcNow
            );
    }
}

