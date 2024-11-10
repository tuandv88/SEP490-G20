using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Votes.Commands.UpdateStatusVote;

public record UpdateStatusVoteResult(bool IsSuccess, bool NewStatus);
public record UpdateStatusVoteCommand(Guid VoteId) : ICommand<UpdateStatusVoteResult>;