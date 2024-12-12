namespace Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;
public record UpdatePinnedDiscussionByIdResult(bool IsSuccess, bool NewStatus);

[Authorize($"{PoliciesType.Administrator}")]
public record UpdatePinnedDiscussionByIdCommand(Guid Id) : ICommand<UpdatePinnedDiscussionByIdResult>;
