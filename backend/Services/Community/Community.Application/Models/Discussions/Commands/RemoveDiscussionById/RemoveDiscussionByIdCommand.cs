namespace Community.Application.Models.Discussions.Commands.RemoveDiscussionById;

public record RemoveDiscussionByIdResult(bool IsSuccess);
public record RemoveDiscussionByIdCommand(Guid Id) : ICommand<RemoveDiscussionByIdResult>;
