using Community.Application.Extensions;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionByUserIdAndDiscussionId;

public class GetUserDiscussionByUserIdAndDiscussionIdHandler : IQueryHandler<GetUserDiscussionByUserIdAndDiscussionIdQuery, GetUserDiscussionByUserIdAndDiscussionIdResult>
{
    private readonly IUserDiscussionRepository _repository;

    public GetUserDiscussionByUserIdAndDiscussionIdHandler(IUserDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserDiscussionByUserIdAndDiscussionIdResult> Handle(GetUserDiscussionByUserIdAndDiscussionIdQuery query, CancellationToken cancellationToken)
    {
        var userDiscussion = await _repository.GetByUserIdAnDiscussionId(query.UserId, query.DiscussionId);

        if (userDiscussion == null)
        {
            var userDiscussionNew = UserDiscussion.Create(UserId.Of(query.UserId), DiscussionId.Of(query.DiscussionId));

            await _repository.AddAsync(userDiscussionNew);
            await _repository.SaveChangesAsync(cancellationToken);


            var userDiscussionDtoNew = userDiscussionNew.ToUserDiscussionDto();
            return new GetUserDiscussionByUserIdAndDiscussionIdResult(userDiscussionDtoNew);
        }

        var userDiscussionDto = userDiscussion.ToUserDiscussionDto();
        return new GetUserDiscussionByUserIdAndDiscussionIdResult(userDiscussionDto);
    }
}
