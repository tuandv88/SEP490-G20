using Community.Application.Models.NotificationHistories.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.NotificationHistories.Commands.CreatesNotificationHistory;

public record CreatesNotificationHistoryResult(bool IsSuccess);
[Authorize]
public record CreatesNotificationHistoryCommand(CreatesNotificationHistoryDto CreatesNotificationHistoryDto) : ICommand<CreatesNotificationHistoryResult>;

public class CreatesNotificationHistoryCommandValidator : AbstractValidator<CreatesNotificationHistoryCommand>
{
    public CreatesNotificationHistoryCommandValidator()
    {
        RuleFor(x => x.CreatesNotificationHistoryDto.NotificationTypeId)
            .NotEmpty().WithMessage("NotificationTypeId must not be empty.");

        RuleFor(x => x.CreatesNotificationHistoryDto.Message)
            .NotEmpty().WithMessage("Message must not be empty.");

        RuleFor(x => x.CreatesNotificationHistoryDto.SentVia)
            .NotEmpty().WithMessage("SentVia must not be empty.")
            .IsEnumName(typeof(SentVia), caseSensitive: false).WithMessage("SentVia must be a valid value (Web, Email, or Both).");

        RuleFor(x => x.CreatesNotificationHistoryDto.Status)
            .NotEmpty().WithMessage("Status must not be empty.")
            .IsEnumName(typeof(Status), caseSensitive: false).WithMessage("Status must be a valid value (Sent, Failed, Pending, or Received).");

        RuleForEach(x => x.CreatesNotificationHistoryDto.UserIdsReceive)
            .NotEmpty().WithMessage("Each UserId must not be empty.");
    }
}
