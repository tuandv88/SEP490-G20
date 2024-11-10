using Community.Application.Models.Comments.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Comments.Commands.CreateComment;

public class CreateCommentHandler : ICommandHandler<CreateCommentCommand, CreateCommentResult>
{
    private readonly ICommentRepository _commentRepository;

    public CreateCommentHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<CreateCommentResult> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var comment = await CreateNewComment(request.CreateCommentDto);

            await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangesAsync(cancellationToken);

            return new CreateCommentResult(comment.Id.Value, true);
        }
        catch (Exception ex)
        {
            return new CreateCommentResult(null, false);
        }
    }

    private async Task<Comment> CreateNewComment(CreateCommentDto createCommentDto)
    {
        var userId = UserId.Of(createCommentDto.UserId);
        var discussionId = DiscussionId.Of(createCommentDto.DiscussionId);
        var parentCommentId = createCommentDto.ParentCommentId.HasValue ? CommentId.Of(createCommentDto.ParentCommentId.Value) : null;

        return Comment.Create(
            commentId: CommentId.Of(Guid.NewGuid()),
            discussionId: discussionId,
            userId: userId,
            content: createCommentDto.Content,
            dateCreated: DateTime.Now,
            parentCommentId: parentCommentId,
            depth: createCommentDto.Depth,
            isActive: createCommentDto.IsActive
        );
    }
}
