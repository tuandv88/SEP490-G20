namespace Community.Application.Models.Discussions.Commands.UpdateStatusDiscussionById;

public record UpdateStatusDiscussionByIdResult(bool IsSuccess, bool NewStatus);
public record UpdateStatusDiscussionByIdCommand(Guid Id) : ICommand<UpdateStatusDiscussionByIdResult>;
