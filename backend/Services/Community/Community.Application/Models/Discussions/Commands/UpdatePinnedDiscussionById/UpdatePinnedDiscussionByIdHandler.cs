using Community.Application.Models.Discussions.Commands.UpdateStatusDiscussionById;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;

public class UpdatePinnedDiscussionByIdHandler : ICommandHandler<UpdatePinnedDiscussionByIdCommand, UpdatePinnedDiscussionByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public UpdatePinnedDiscussionByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdatePinnedDiscussionByIdResult> Handle(UpdatePinnedDiscussionByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        // Chuyển đổi trạng thái IsActive
        discussion.Pinned = !discussion.Pinned;

        await _repository.UpdateAsync(discussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdatePinnedDiscussionByIdResult(true, discussion.IsActive);
    }
}

