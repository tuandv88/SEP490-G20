namespace Community.Application.Models.Discussions.Commands.RemoveDiscussionById;

public class RemoveDiscussionByIdHandler : ICommandHandler<RemoveDiscussionByIdCommand, RemoveDiscussionByIdResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IFilesService _filesService;

    public RemoveDiscussionByIdHandler(IDiscussionRepository discussionRepository, IFilesService filesService)
    {
        _discussionRepository = discussionRepository;
        _filesService = filesService;
    }

    public async Task<RemoveDiscussionByIdResult> Handle(RemoveDiscussionByIdCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.Id);
        }

        if (!String.IsNullOrEmpty(discussion.ImageUrl))
        {
            var oldImageUrl = discussion.ImageUrl;
            await _filesService.DeleteFileAsync(StorageConstants.BUCKET, oldImageUrl);
        }


        await _discussionRepository.DeleteByIdAsync(request.Id);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        return new RemoveDiscussionByIdResult(true);
    }
}
