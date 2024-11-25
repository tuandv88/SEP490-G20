namespace Community.Application.Models.Comments.Commands.RemoveCommentById;

public record RemoveCommentByIdResult(Guid Id, bool IsSuccess, string Message);
[Authorize($"{PoliciesType.Administrator},{PoliciesType.Moderator},{PoliciesType.Learner}")]
public record RemoveCommentByIdCommand(Guid Id) : ICommand<RemoveCommentByIdResult>;
