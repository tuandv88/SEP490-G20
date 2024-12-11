using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using User.Application.Data.Repositories;
using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Application.Models.PointHistories.EnventHandlers.Integrations;
public class DeductPointsCommandHandler(IPointHistoryRepository pointHistoryRepository, IPublishEndpoint publishEndpoint) : IConsumer<DeductPointsCommand> {
    public async Task Consume(ConsumeContext<DeductPointsCommand> context) {
        var message = context.Message;
        var point = await pointHistoryRepository.GetTotalRemainingPointsByUserIdAsync(message.UserId);
        if (point >= message.PointsUsed) {
            if (message.PointsUsed > 0) {
                var pointHistory = CreateNewPointHistory(message.PointsUsed, message.UserId, message.Source);
                await pointHistoryRepository.AddAsync(pointHistory);
            }
            await publishEndpoint.Publish(new PointsDeductedEvent() {
                TransactionId = message.TransactionId
            });
        } else {
            await publishEndpoint.Publish(new PointsNotSufficientEvent() {
                TransactionId = message.TransactionId
            });
        }
        await pointHistoryRepository.SaveChangesAsync();
    }

    private PointHistory CreateNewPointHistory(long point, Guid userId, string source) {
        return PointHistory.Create(
            PointHistoryId.Of(Guid.NewGuid()),
            UserId.Of(userId),
            point,
            ChangeType.Deducted,
            source,
            DateTime.UtcNow,
            DateTime.UtcNow
            );
    }
}

