using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Discussions.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Queries.GetDiscussionDetailById;

public record GetDiscussionDetailByIdResult(DiscussionDetailDto DiscussionDetailDto);

public record GetDiscussionDetailByIdQuery(Guid Id) : IQuery<GetDiscussionDetailByIdResult>;
