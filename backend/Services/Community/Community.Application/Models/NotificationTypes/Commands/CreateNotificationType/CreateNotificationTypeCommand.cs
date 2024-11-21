using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.Application.Models.NotificationTypes.Commands.CreateNotificationType;

public record CreateNotificationTypeResult(Guid? Id, bool IsSuccess);

public record CreateNotificationTypeCommand(CreateNotificationTypeDto CreateNotificationTypeDto) : ICommand<CreateNotificationTypeResult>;

public class CreateNotificationTypeCommandValidator : AbstractValidator<CreateNotificationTypeCommand>
{
    public CreateNotificationTypeCommandValidator()
    {
        RuleFor(x => x.CreateNotificationTypeDto.Name)
            .NotEmpty().WithMessage("Name must not be empty.");

        RuleFor(x => x.CreateNotificationTypeDto.Description)
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.CreateNotificationTypeDto.Priority)
            .InclusiveBetween(1, 5).WithMessage("Priority must be between 1 and 5.");
    }
}
