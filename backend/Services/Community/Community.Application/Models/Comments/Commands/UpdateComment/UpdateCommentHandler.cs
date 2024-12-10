using Community.Application.Models.Comments.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;
using Community.Application.Interfaces;

namespace Community.Application.Models.Comments.Commands.UpdateComment;

public class UpdateCommentHandler : ICommandHandler<UpdateCommentCommand, UpdateCommentResult>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IUserContextService _userContextService;

    public UpdateCommentHandler(ICommentRepository commentRepository, IDiscussionRepository discussionRepository, IUserContextService userContextService)
    {
        _commentRepository = commentRepository;
        _discussionRepository = discussionRepository;
        _userContextService = userContextService;
    }

    public async Task<UpdateCommentResult> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetByIdAsync(request.UpdateCommentDto.Id);

        if (comment == null)
        {
            throw new NotFoundException("Comment not found.", request.UpdateCommentDto.Id);
        }

        // Kiểm tra xem Discussion có tồn tại không
        var discussionExists = await _discussionRepository.GetByIdAsync(request.UpdateCommentDto.DiscussionId);
        if (discussionExists == null)
        {
            throw new NotFoundException("Discussion not found.", request.UpdateCommentDto.DiscussionId);
        }

        UpdateCommentWithNewValues(comment, request.UpdateCommentDto);

        await _commentRepository.UpdateAsync(comment);
        await _commentRepository.SaveChangesAsync(cancellationToken);

        return new UpdateCommentResult(true);
    }

    private void UpdateCommentWithNewValues(Comment comment, UpdateCommentDto updateCommentDto)
    {
        // Dữ liệu test UserId
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = UserId.Of(currentUserId);

        comment.UserId = userId;
        comment.DiscussionId = DiscussionId.Of(updateCommentDto.DiscussionId);
        comment.Content = updateCommentDto.Content;
        comment.ParentCommentId = updateCommentDto.ParentCommentId.HasValue ? CommentId.Of(updateCommentDto.ParentCommentId.Value) : null;
        comment.Depth = updateCommentDto.Depth;
        comment.IsActive = updateCommentDto.IsActive;
        comment.DateCreated = comment.DateCreated;
        comment.IsEdited = true; // Đánh dấu comment đã được chỉnh sửa
    }
}
