using Community.Application.Models.NotificationHistories.Dtos;

namespace Community.Application.Models.NotificationHistories.Queries.GetNotificationHistories;
public record GetNotificationHistoriesResult(PaginatedResult<NotificationHistoryDto> NotificationHistoryDtos);
public record GetNotificationHistoriesQuery(PaginationRequest PaginationRequest) : IQuery<GetNotificationHistoriesResult>;
public class GetNotificationHistoriesValidator : AbstractValidator<GetNotificationHistoriesQuery>
{
    public GetNotificationHistoriesValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
