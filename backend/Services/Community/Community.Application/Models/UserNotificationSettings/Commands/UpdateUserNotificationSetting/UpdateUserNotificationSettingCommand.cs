using Community.Application.Models.UserNotificationSettings.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.UserNotificationSettings.Commands.UpdateUserNotificationSetting;

public record UpdateUserNotificationSettingResult(bool IsSuccess);
public record UpdateUserNotificationSettingCommand(UpdateUserNotificationSettingDto UpdateUserNotificationSettingDto): ICommand<UpdateUserNotificationSettingResult>;

public class UpdateUserNotificationSettingCommandValidator : AbstractValidator<UpdateUserNotificationSettingCommand>
{
    public UpdateUserNotificationSettingCommandValidator()
    {
        RuleFor(x => x.UpdateUserNotificationSettingDto)
            .NotNull()
            .WithMessage("UpdateUserNotificationSettingDto must not be null.");

        When(x => x.UpdateUserNotificationSettingDto != null, () =>
        {
            RuleFor(x => x.UpdateUserNotificationSettingDto.NotificationFrequency)
                .Must(value => Enum.TryParse<NotificationFrequency>(value, true, out _) && Enum.IsDefined(typeof(NotificationFrequency), value))
                .WithMessage("Invalid NotificationFrequency value. Valid values are: Daily, Weekly, Monthly.");
        });
    }
}