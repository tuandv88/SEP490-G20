using Community.Application.Models.UserDiscussions.Commands.RemoveUserDiscussionById;

namespace Community.Application.Models.UserDiscussions.Commands.RemoveUserDiscussionById;

public class RemoveUserDiscussionByIdHandler : ICommandHandler<RemoveUserDiscussionByIdCommand, RemoveUserDiscussionByIdResult>
{
    private readonly IUserDiscussionRepository _userDiscussionRepository;

    public RemoveUserDiscussionByIdHandler(IUserDiscussionRepository userDiscussionRepository)
    {
        _userDiscussionRepository = userDiscussionRepository;
    }

    public async Task<RemoveUserDiscussionByIdResult> Handle(RemoveUserDiscussionByIdCommand request, CancellationToken cancellationToken)
    {
        var userDiscussion = await _userDiscussionRepository.GetByIdAsync(request.Id);

        if (userDiscussion == null)
        {
            return new RemoveUserDiscussionByIdResult(request.Id, false, "UserDiscussion not found.");
        }

        await _userDiscussionRepository.DeleteByIdAsync(request.Id);
        await _userDiscussionRepository.SaveChangesAsync(cancellationToken);

        return new RemoveUserDiscussionByIdResult(request.Id, true, "UserDiscussion removed successfully.");
    }
}
