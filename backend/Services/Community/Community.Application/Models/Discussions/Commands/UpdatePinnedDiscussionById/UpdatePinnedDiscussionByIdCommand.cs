namespace Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;
public record UpdatePinnedDiscussionByIdResult(bool IsSuccess, bool NewStatus);
public record UpdatePinnedDiscussionByIdCommand(Guid Id) : ICommand<UpdatePinnedDiscussionByIdResult>;
