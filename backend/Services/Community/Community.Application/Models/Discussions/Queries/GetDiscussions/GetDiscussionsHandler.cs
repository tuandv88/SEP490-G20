using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussions;

public class GetDiscussionsHandler : IQueryHandler<GetDiscussionsQuery, GetDiscussionsResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly IFilesService _filesService;

    public GetDiscussionsHandler(IDiscussionRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionsResult> Handle(GetDiscussionsQuery query, CancellationToken cancellationToken)
    {
        var allDiscussions = await _repository.GetAllDetailIsActiveAsync();

        var discussionDtos = await allDiscussions.ToDiscussionDtoListAsync(_filesService);

        return new GetDiscussionsResult(discussionDtos);

    }
}
