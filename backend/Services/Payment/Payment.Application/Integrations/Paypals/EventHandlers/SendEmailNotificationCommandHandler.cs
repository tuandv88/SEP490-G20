using BuildingBlocks.Email.Constants;
using BuildingBlocks.Email.Helpers;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Payment.Application.Data;

namespace Payment.Application.Integrations.Paypals.EventHandlers;

public class SendEmailNotificationCommandHandler(
    IEmailService emailService,
    IPublishEndpoint publishEndpoint,
    ILogger<SendEmailNotificationCommandHandler> logger,
    IConfiguration configuration,
    IApplicationDbContext dbContext) : IConsumer<SendEmailNotificationCommand>
{
    public async Task Consume(ConsumeContext<SendEmailNotificationCommand> context)
    {
        var message = context.Message;
        var webUrl = configuration["WebUrl"]!;
        var urlCourse = $"{webUrl}/course-detail/{message.ProductId}";
        logger.LogInformation($"Send mail start with transactionId: {message.TransactionId} and email: {message.Email}");
        switch (message.EmailType)
        {
            case EmailType.PaymentSuccess:
            {
                var emailBody = EmailHtmlTemplates.PaymentSuccessfullyTemplate(
                    message.Fullname, "icoder@icoder.vn", message.ProductName, message.Amount, message.PaymentType,
                    DateTime.UtcNow, message.TransactionId.ToString(), urlCourse);

                var emailMetadata = new EmailMetadata(
                    toAddress: message.Email,
                    subject: "Payment successful at icoder.vn",
                    body: emailBody
                );

                await emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.NOTIFICATION);
                await publishEndpoint.Publish(new EmailSentEvent()
                {
                    TransactionId = context.Message.TransactionId
                });
                logger.LogDebug($"Send mail success \"Payment success\" with transactionId: {message.TransactionId} and email: {message.Email}");
                break;
            }
            case EmailType.PaymentFailed:
            {
                var emailBody = EmailHtmlTemplates.PaymentFailureTemplate(
                    message.Fullname, "icoder@icoder.vn", message.ProductName, message.Amount, message.PaymentType,
                    DateTime.UtcNow, message.TransactionId.ToString(), urlCourse);

                var emailMetadata = new EmailMetadata(
                    toAddress: message.Email,
                    subject: "Payment failed at icoder.vn",
                    body: emailBody
                );

                await emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.NOTIFICATION);
                await publishEndpoint.Publish(new EmailSentEvent()
                {
                    TransactionId = context.Message.TransactionId
                });
                logger.LogDebug($"Send mail success \"Payment failed\" with transactionId: {message.TransactionId} and email: {message.Email}");
                break;
            }
        }

        await dbContext.SaveChangesAsync();
    }
}