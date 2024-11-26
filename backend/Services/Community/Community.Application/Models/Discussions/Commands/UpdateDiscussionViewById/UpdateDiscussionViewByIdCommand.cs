using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Commands.UpdateDiscussionViewById;

public record UpdateDiscussionViewByIdResult(bool IsSuccess, long viewCount);
[Authorize]
public record UpdateDiscussionViewByIdCommand(Guid Id) : ICommand<UpdateDiscussionViewByIdResult>;
