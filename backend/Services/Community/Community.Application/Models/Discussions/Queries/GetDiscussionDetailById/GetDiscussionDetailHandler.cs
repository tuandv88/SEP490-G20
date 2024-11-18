using Community.Application.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionDetailById;

public class GetDiscussionDetailHandler : IQueryHandler<GetDiscussionDetailByIdQuery, GetDiscussionDetailByIdResult>
{
    private readonly IDiscussionRepository _repository;
    private readonly IFilesService _filesService;

    public GetDiscussionDetailHandler(IDiscussionRepository repository, IFilesService filesService)
    {
        _repository = repository;
        _filesService = filesService;
    }

    public async Task<GetDiscussionDetailByIdResult> Handle(GetDiscussionDetailByIdQuery query, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdDetailAsync(query.Id);

        if(discussion == null)
        {
            throw new NotFoundException("Discussion not found.", query.Id);
        }

        var discussionDto = await discussion.ToDiscussionDetailDtoAsync(_filesService)!;

        return new GetDiscussionDetailByIdResult(discussionDto);
    }
}
