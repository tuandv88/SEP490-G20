using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using Payment.Application.Data.Repositories;
using Payment.Domain.Enums;

namespace Payment.Application.Integrations.Paypals.EventHandlers;

public class SetTransactionFailedCommandHandler(ITransactionRepository transactionRepository) : IConsumer<SetTransactionFailedCommand>
{
    public async Task Consume(ConsumeContext<SetTransactionFailedCommand> context)
    {
        var message = context.Message;
        var transaction = await transactionRepository.GetByIdAsync(message.TransactionId);
        if (transaction != null)
        {
            transaction.Status = TransactionStatus.Failed;
            await transactionRepository.UpdateAsync(transaction);
            await transactionRepository.SaveChangesAsync();
        }
    }
}