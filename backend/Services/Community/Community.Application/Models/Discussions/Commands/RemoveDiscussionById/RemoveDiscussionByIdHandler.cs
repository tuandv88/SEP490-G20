namespace Community.Application.Models.Discussions.Commands.RemoveDiscussionById;

public class RemoveDiscussionByIdHandler : ICommandHandler<RemoveDiscussionByIdCommand, RemoveDiscussionByIdResult>
{
    private readonly IDiscussionRepository _discussionRepository;

    public RemoveDiscussionByIdHandler(IDiscussionRepository discussionRepository)
    {
        _discussionRepository = discussionRepository;
    }

    public async Task<RemoveDiscussionByIdResult> Handle(RemoveDiscussionByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        await _discussionRepository.DeleteByIdAsync(request.Id);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        return new RemoveDiscussionByIdResult(true);
    }
}
