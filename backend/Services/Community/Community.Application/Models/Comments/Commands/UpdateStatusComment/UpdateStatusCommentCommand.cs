namespace Community.Application.Models.Comments.Commands.UpdateStatusComment;

public record UpdateStatusCommentResult(bool IsSuccess, bool NewStatus);
public record UpdateStatusCommentCommand(Guid Id) : ICommand<UpdateStatusCommentResult>;