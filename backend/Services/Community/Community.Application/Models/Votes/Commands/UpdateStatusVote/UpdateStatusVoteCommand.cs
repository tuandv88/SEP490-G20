namespace Community.Application.Models.Votes.Commands.UpdateStatusVote;

public record UpdateStatusVoteResult(bool IsSuccess, bool NewStatus);
[Authorize]
public record UpdateStatusVoteCommand(Guid VoteId) : ICommand<UpdateStatusVoteResult>;