namespace Community.Application.Models.UserDiscussions.Queries.GetUserIdsWithNotificationsEnabled;
[Authorize]
public record GetUserIdsWithNotificationsEnabledQuery(Guid DiscussionId) : IQuery<GetUserIdsWithNotificationsEnabledResult>;

public record GetUserIdsWithNotificationsEnabledResult(List<Guid> UserIds);
