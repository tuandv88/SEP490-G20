using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.Application.Models.NotificationHistories.Commands.CreateNotificationHistory;

public record CreateNotificationHistoryResult(Guid? Id, bool IsSuccess);

public record CreateNotificationHistoryCommand(CreateNotificationHistoryDto CreateNotificationHistoryDto) : ICommand<CreateNotificationHistoryResult>;

public class CreateNotificationHistoryCommandValidator : AbstractValidator<CreateNotificationHistoryCommand>
{
    public CreateNotificationHistoryCommandValidator()
    {
        RuleFor(x => x.CreateNotificationHistoryDto.NotificationTypeId)
            .NotEmpty().WithMessage("NotificationTypeId must not be empty.");

        RuleFor(x => x.CreateNotificationHistoryDto.Message)
            .NotEmpty().WithMessage("Message must not be empty.");

        RuleFor(x => x.CreateNotificationHistoryDto.SentVia)
            .NotEmpty().WithMessage("SentVia must not be empty.")
            .IsEnumName(typeof(SentVia), caseSensitive: false).WithMessage("SentVia must be a valid value (Web, Email, or Both).");

        RuleFor(x => x.CreateNotificationHistoryDto.Status)
            .NotEmpty().WithMessage("Status must not be empty.")
            .IsEnumName(typeof(Status), caseSensitive: false).WithMessage("Status must be a valid value (Sent, Failed, Pending, or Received).");
    }
}
