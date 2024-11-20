using Community.Application.Models.NotificationTypes.Dtos;

namespace Community.Application.Models.NotificationTypes.Queries.GetNotificationTypesPaging;

public record GetNotificationTypesPagingResult(PaginatedResult<NotificationTypeDto> NotificationTypeDtos);

public record GetNotificationTypesPagingQuery(PaginationRequest PaginationRequest) : IQuery<GetNotificationTypesPagingResult>;

public class GetNotificationTypesPagingValidator : AbstractValidator<GetNotificationTypesPagingQuery>
{
    public GetNotificationTypesPagingValidator()
    {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(15)
            .WithMessage("PageSize must be less than or equal to 15.");
    }
}
