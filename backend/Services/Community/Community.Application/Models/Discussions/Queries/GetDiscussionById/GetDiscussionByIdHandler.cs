using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussionById;

public class GetDiscussionByIdHandler : IQueryHandler<GetDiscussionByIdQuery, GetDiscussionByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public GetDiscussionByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetDiscussionByIdResult> Handle(GetDiscussionByIdQuery query, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(query.id);
        var discussionDto = discussion?.ToDiscussionDto();

        return new GetDiscussionByIdResult(discussionDto);

    }
}
