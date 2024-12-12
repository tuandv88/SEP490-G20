using Community.Application.Extensions;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserIdsWithNotificationsEnabled;

public class GetUserIdsWithNotificationsEnabledHandler
    : IQueryHandler<GetUserIdsWithNotificationsEnabledQuery, GetUserIdsWithNotificationsEnabledResult>
{
    private readonly IUserDiscussionRepository _repository;

    public GetUserIdsWithNotificationsEnabledHandler(IUserDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserIdsWithNotificationsEnabledResult> Handle(GetUserIdsWithNotificationsEnabledQuery query,CancellationToken cancellationToken)
    {
        var userIds = await _repository.GetUserIdsWithNotificationsEnabledAsync(query.DiscussionId);
        return new GetUserIdsWithNotificationsEnabledResult(userIds);
    }
}
