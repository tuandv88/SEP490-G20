namespace Community.Application.Models.Discussions.Commands.RemoveDiscussionById;

public record RemoveDiscussionByIdResult(bool IsSuccess);
[Authorize]
public record RemoveDiscussionByIdCommand(Guid Id) : ICommand<RemoveDiscussionByIdResult>;
