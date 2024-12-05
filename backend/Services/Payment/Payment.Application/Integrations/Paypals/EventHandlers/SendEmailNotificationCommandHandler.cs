using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using Microsoft.Extensions.Logging;
using Payment.Application.Data;

namespace Payment.Application.Integrations.Paypals.EventHandlers;
public class SendEmailNotificationCommandHandler(IEmailService emailService, IPublishEndpoint publishEndpoint, ILogger<SendEmailNotificationCommandHandler> logger, IApplicationDbContext dbContext) : IConsumer<SendEmailNotificationCommand> {
    public async Task Consume(ConsumeContext<SendEmailNotificationCommand> context) {
        logger.LogInformation("Send mail thành công");
        //TODO
        await publishEndpoint.Publish(new EmailSentEvent() {
            TransactionId = context.Message.TransactionId
        });
        await dbContext.SaveChangesAsync();
    }
}

