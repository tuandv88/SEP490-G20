using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionsTop;


public class GetDiscussionsTopHandler : IQueryHandler<GetDiscussionsTopQuery, GetDiscussionsTopResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IFilesService _filesService;

    public GetDiscussionsTopHandler(IDiscussionRepository repository, ICategoryRepository categoryRepository, IFilesService filesService)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionsTopResult> Handle(GetDiscussionsTopQuery query, CancellationToken cancellationToken)
    {
        var discussions = await _repository.GetAllDetailIsActiveAsync();

        var topDiscussions = discussions.OrderByDescending(d => d.DateCreated).Take(5).ToList();

        var discussionDtos = await topDiscussions.ToDiscussionsTopDtoListAsync(_filesService);

        return new GetDiscussionsTopResult(discussionDtos);

    }
}
