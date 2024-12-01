using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.Application.Models.NotificationHistories.Queries.GetNotificationHistoriesDetail;

public record GetNotificationHistoriesDetailByUserIdResult(PaginatedResult<NotificationHistoryDto> NotificationHistoryDtos);
[Authorize]
public record GetNotificationHistoriesDetailByUserIdQuery(PaginationRequest PaginationRequest) : IQuery<GetNotificationHistoriesDetailByUserIdResult>;
public class GetNotificationHistoriesDetailByUserIdValidator : AbstractValidator<GetNotificationHistoriesDetailByUserIdQuery>
{
    public GetNotificationHistoriesDetailByUserIdValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
