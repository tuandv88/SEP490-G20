using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.Application.Models.Notifications.Commands.UpdateNotificationHistory;

public record UpdateNotificationHistoryResult(bool IsSuccess);
public record UpdateNotificationHistoryCommand(UpdateNotificationHistoryDto UpdateNotificationHistoryDto) : ICommand<UpdateNotificationHistoryResult>;

public class UpdateNotificationHistoryCommandValidator : AbstractValidator<UpdateNotificationHistoryCommand>
{
    public UpdateNotificationHistoryCommandValidator()
    {
        RuleFor(x => x.UpdateNotificationHistoryDto)
            .NotNull()
            .WithMessage("UpdateNotificationHistoryDto must not be null.");

        When(x => x.UpdateNotificationHistoryDto != null, () =>
        {
            RuleFor(x => x.UpdateNotificationHistoryDto.Message)
                .NotEmpty()
                .WithMessage("Message must not be empty.");

            RuleFor(x => x.UpdateNotificationHistoryDto.NotificationTypeId)
                .NotEmpty()
                .WithMessage("NotificationTypeId must not be empty.");

            RuleFor(x => x.UpdateNotificationHistoryDto.SentVia)
                .Must(value => Enum.TryParse<SentVia>(value, true, out _) && Enum.IsDefined(typeof(SentVia), value))
                .WithMessage("Invalid SentVia value. Valid values are: Web, Email, Both.");

            RuleFor(x => x.UpdateNotificationHistoryDto.Status)
                .Must(value => Enum.TryParse<Status>(value, true, out _) && Enum.IsDefined(typeof(Status), value))
                .WithMessage("Invalid Status value. Valid values are: Sent, Failed, Pending, Received.");
        });
    }
}


