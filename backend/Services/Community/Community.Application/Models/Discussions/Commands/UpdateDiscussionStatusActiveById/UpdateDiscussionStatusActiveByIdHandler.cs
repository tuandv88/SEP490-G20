namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusActiveById;

public class UpdateDiscussionStatusActiveByIdHandler : ICommandHandler<UpdateDiscussionStatusActiveByIdCommand, UpdateDiscussionStatusActiveByIdResult>
{
    private readonly IDiscussionRepository _repository;

    public UpdateDiscussionStatusActiveByIdHandler(IDiscussionRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateDiscussionStatusActiveByIdResult> Handle(UpdateDiscussionStatusActiveByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _repository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        // Chuyển đổi trạng thái NotificationsEnabled
        discussion.IsActive = !discussion.IsActive;
        discussion.DateUpdated = DateTime.Now;

        await _repository.UpdateAsync(discussion);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateDiscussionStatusActiveByIdResult(true, discussion.IsActive);
    }
}