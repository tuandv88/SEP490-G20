using Community.Application.Models.UserNotificationSettings.Dtos;

namespace Community.Application.Models.UserNotificationSettings.Queries.GetUserNotificationSettings;

public record GetUserNotificationSettingsPagingResult(PaginatedResult<UserNotificationSettingDto> UserNotificationSettingDtos);

public record GetUserNotificationSettingsQuery(PaginationRequest PaginationRequest) : IQuery<GetUserNotificationSettingsPagingResult>;

public class GetUserNotificationSettingsPagingValidator : AbstractValidator<GetUserNotificationSettingsQuery>
{
    public GetUserNotificationSettingsPagingValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
