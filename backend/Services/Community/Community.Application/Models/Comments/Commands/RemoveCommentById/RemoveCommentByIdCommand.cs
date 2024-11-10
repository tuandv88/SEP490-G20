namespace Community.Application.Models.Comments.Commands.RemoveCommentById;

public record RemoveCommentByIdResult(Guid Id, bool IsSuccess, string Message);
public record RemoveCommentByIdCommand(Guid Id) : ICommand<RemoveCommentByIdResult>;
