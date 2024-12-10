using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.Application.Models.UserNotificationSettings.Commands.CreateUserNotificationSetting;

public record CreateUserNotificationSettingResult(Guid? Id, bool IsSuccess);

public record CreateUserNotificationSettingCommand(CreateUserNotificationSettingDto CreateUserNotificationSettingDto) : ICommand<CreateUserNotificationSettingResult>;

public class CreateUserNotificationSettingCommandValidator : AbstractValidator<CreateUserNotificationSettingCommand>
{
    public CreateUserNotificationSettingCommandValidator()
    {
        RuleFor(x => x.CreateUserNotificationSettingDto.IsNotificationEnabled)
            .NotNull().WithMessage("IsNotificationEnabled must not be null.");

        RuleFor(x => x.CreateUserNotificationSettingDto.IsEmailEnabled)
            .NotNull().WithMessage("IsEmailEnabled must not be null.");

        RuleFor(x => x.CreateUserNotificationSettingDto.IsWebsiteEnabled)
            .NotNull().WithMessage("IsWebsiteEnabled must not be null.");

        RuleFor(x => x.CreateUserNotificationSettingDto.NotificationFrequency)
            .NotEmpty().WithMessage("NotificationFrequency must not be empty.");
    }
}
