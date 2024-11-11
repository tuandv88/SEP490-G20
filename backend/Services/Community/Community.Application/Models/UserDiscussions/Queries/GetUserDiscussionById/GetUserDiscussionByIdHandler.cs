using Community.Application.Extensions;

namespace Community.Application.Models.UserDiscussions.Queries.GetUserDiscussionById;

public class GetUserDiscussionByIdHandler : IQueryHandler<GetUserDiscussionByIdQuery, GetUserDiscussionByIdResult>
{
    private readonly IUserDiscussionRepository _repository;

    public GetUserDiscussionByIdHandler(IUserDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetUserDiscussionByIdResult> Handle(GetUserDiscussionByIdQuery query, CancellationToken cancellationToken)
    {
        var userDiscussion = await _repository.GetByIdAsync(query.Id);

        if (userDiscussion == null)
        {
            return new GetUserDiscussionByIdResult(null);
        }

        var userDiscussionDto = userDiscussion.ToUserDiscussionDto();

        return new GetUserDiscussionByIdResult(userDiscussionDto);
    }
}