using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussions;

public class GetDiscussionsHandler : IQueryHandler<GetDiscussionsQuery, GetDiscussionsResult>
{
    private readonly IDiscussionRepository _repository;

    public GetDiscussionsHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetDiscussionsResult> Handle(GetDiscussionsQuery query, CancellationToken cancellationToken)
    {
        var allDiscussions = await _repository.GetAllAsync();

        var discussionDtos = await allDiscussions.ToDiscussionDtoListAsync();

        return new GetDiscussionsResult(discussionDtos);

    }
}
