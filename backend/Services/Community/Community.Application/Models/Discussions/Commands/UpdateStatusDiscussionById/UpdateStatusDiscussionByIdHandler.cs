using Community.Application.Models.Comments.Commands.UpdateStatusComment;

namespace Community.Application.Models.Discussions.Commands.UpdateStatusDiscussionById;

public class UpdateStatusDiscussionByIdHandler : ICommandHandler<UpdateStatusDiscussionByIdCommand, UpdateStatusDiscussionByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public UpdateStatusDiscussionByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateStatusDiscussionByIdResult> Handle(UpdateStatusDiscussionByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        // Chuyển đổi trạng thái IsActive
        discussion.IsActive = !discussion.IsActive;
        discussion.DateUpdated = DateTime.Now;

        await _repository.UpdateAsync(discussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateStatusDiscussionByIdResult(true, discussion.IsActive);
    }
}
