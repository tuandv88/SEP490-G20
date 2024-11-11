namespace Community.Application.Models.Votes.Commands.RemoveVoteById;
public record RemoveVoteByIdResult(Guid Id, bool IsSuccess, string Message);
public record RemoveVoteByIdCommand(Guid VoteId) : ICommand<RemoveVoteByIdResult>;
