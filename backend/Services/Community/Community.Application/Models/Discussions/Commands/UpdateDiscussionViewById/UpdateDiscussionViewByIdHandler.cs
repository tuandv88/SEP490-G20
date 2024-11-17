using Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionViewById;

public class UpdateDiscussionViewByIdHandler : ICommandHandler<UpdateDiscussionViewByIdCommand, UpdateDiscussionViewByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public UpdateDiscussionViewByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateDiscussionViewByIdResult> Handle(UpdateDiscussionViewByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        // Chuyển đổi trạng thái IsActive
        discussion.ViewCount += 1;

        await _repository.UpdateAsync(discussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateDiscussionViewByIdResult(true, discussion.ViewCount);
    }
}
