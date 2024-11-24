namespace Community.Application.Models.UserDiscussions.Commands.RemoveUserDiscussionById;
[Authorize]
public record RemoveUserDiscussionByIdCommand(Guid Id) : ICommand<RemoveUserDiscussionByIdResult>;
public record RemoveUserDiscussionByIdResult(Guid Id, bool IsSuccess, string Message);
