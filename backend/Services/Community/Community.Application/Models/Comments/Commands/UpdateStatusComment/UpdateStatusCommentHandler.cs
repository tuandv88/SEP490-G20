namespace Community.Application.Models.Comments.Commands.UpdateStatusComment;

public class UpdateStatusCommentHandler : ICommandHandler<UpdateStatusCommentCommand, UpdateStatusCommentResult>
{
    private readonly ICommentRepository _repository;

    public UpdateStatusCommentHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<UpdateStatusCommentResult> Handle(UpdateStatusCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _repository.GetByIdAsync(request.Id);

        if (comment == null)
        {
            throw new NotFoundException("Comment not found.", request.Id);
        }

        // Chuyển đổi trạng thái IsActive
        comment.IsActive = !comment.IsActive;

        await _repository.UpdateAsync(comment);
        await _repository.SaveChangesAsync(cancellationToken);

        return new UpdateStatusCommentResult(true, comment.IsActive);
    }
}