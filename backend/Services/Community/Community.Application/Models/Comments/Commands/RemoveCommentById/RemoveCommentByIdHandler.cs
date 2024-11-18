using Community.Application.Models.Comments.Commands.RemoveCommentById;

namespace Community.Application.Models.Comments.Commands.DeleteCommentById;

public class RemoveCommentByIdHandler : ICommandHandler<RemoveCommentByIdCommand, RemoveCommentByIdResult>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IVoteRepository _voteRepository;

    public RemoveCommentByIdHandler(ICommentRepository commentRepository, IVoteRepository voteRepository)
    {
        _commentRepository = commentRepository;
        _voteRepository = voteRepository;
    }

    public async Task<RemoveCommentByIdResult> Handle(RemoveCommentByIdCommand request, CancellationToken cancellationToken)
    {
        // Tìm comment cần xóa
        var comment = await _commentRepository.GetByIdAsync(request.Id);

        if (comment == null)
        {
            return new RemoveCommentByIdResult(request.Id, false, "Comment not found.");
        }

        // Tìm và xóa các vote thuộc về comment này
        var votesToDelete = await _voteRepository.GetVotesByCommentIdAsync(request.Id);
        foreach(var vote in votesToDelete)
        {
            await _voteRepository.DeleteAsync(vote);

        }

        // Xóa comment
        await _commentRepository.DeleteByIdAsync(request.Id);

        // Save thay đổi
        await _voteRepository.SaveChangesAsync(cancellationToken);
        await _commentRepository.SaveChangesAsync(cancellationToken);

        return new RemoveCommentByIdResult(request.Id, true, "Comment and related votes removed successfully.");
    }
}
