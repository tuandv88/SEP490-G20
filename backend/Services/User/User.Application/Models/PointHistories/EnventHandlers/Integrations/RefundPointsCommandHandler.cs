using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using User.Application.Data.Repositories;
using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Application.Models.PointHistories.EnventHandlers.Integrations;

public class RefundPointsCommandHandler(IPointHistoryRepository pointHistoryRepository) : IConsumer<RefundPointsCommand>
{
    public async Task Consume(ConsumeContext<RefundPointsCommand> context)
    {
        var message = context.Message;
        if (message.PointsUsed > 0)
        {
            var pointHistory = CreateNewPointHistory(message.PointsUsed, message.UserId, message.Source);
            await pointHistoryRepository.AddAsync(pointHistory);
            await pointHistoryRepository.SaveChangesAsync();
        }
    }

    private PointHistory CreateNewPointHistory(long point, Guid userId, string source)
    {
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