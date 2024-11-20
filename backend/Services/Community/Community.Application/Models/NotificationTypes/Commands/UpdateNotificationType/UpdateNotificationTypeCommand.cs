using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.Application.Models.NotificationTypes.Commands.UpdateNotificationType;

public record UpdateNotificationTypeCommand(UpdateNotificationTypeDto UpdateNotificationTypeDto)
    : ICommand<UpdateNotificationTypeResult>;

public record UpdateNotificationTypeResult(bool IsSuccess);

public class UpdateNotificationTypeCommandValidator : AbstractValidator<UpdateNotificationTypeCommand>
{
    public UpdateNotificationTypeCommandValidator()
    {
        RuleFor(x => x.UpdateNotificationTypeDto)
            .NotNull()
            .WithMessage("UpdateNotificationTypeDto must not be null.");

        When(x => x.UpdateNotificationTypeDto != null, () =>
        {
            RuleFor(x => x.UpdateNotificationTypeDto.Name)
                .NotEmpty()
                .WithMessage("Name must not be empty.");

            RuleFor(x => x.UpdateNotificationTypeDto.Description)
                .NotEmpty()
                .WithMessage("Description must not be empty.");

            RuleFor(x => x.UpdateNotificationTypeDto.Priority)
                .InclusiveBetween(1, 5)
                .WithMessage("Priority must be between 1 and 5.");
        });
    }
}