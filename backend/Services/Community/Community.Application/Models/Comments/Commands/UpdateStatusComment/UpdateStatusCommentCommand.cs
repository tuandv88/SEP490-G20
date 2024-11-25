namespace Community.Application.Models.Comments.Commands.UpdateStatusComment;

public record UpdateStatusCommentResult(bool IsSuccess, bool NewStatus);
[Authorize($"{PoliciesType.Administrator},{PoliciesType.Moderator},{PoliciesType.Learner}")]
public record UpdateStatusCommentCommand(Guid Id) : ICommand<UpdateStatusCommentResult>;