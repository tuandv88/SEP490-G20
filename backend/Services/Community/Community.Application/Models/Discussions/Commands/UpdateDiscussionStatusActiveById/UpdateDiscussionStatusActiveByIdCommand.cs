namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusActiveById;

public record UpdateDiscussionStatusActiveByIdResult(bool IsSuccess, bool NewStatus);
[Authorize($"{PoliciesType.Administrator}")]
public record UpdateDiscussionStatusActiveByIdCommand(Guid Id) : ICommand<UpdateDiscussionStatusActiveByIdResult>;
