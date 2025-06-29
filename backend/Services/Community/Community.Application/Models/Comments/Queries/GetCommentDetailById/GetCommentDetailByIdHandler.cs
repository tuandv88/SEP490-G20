﻿using Community.Application.Extensions;
using Community.Application.Models.Discussions.Queries.GetDiscussionById;

namespace Community.Application.Models.Comments.Queries.GetCommentDetailById
{
    public class GetCommentDetailByIdHandler : IQueryHandler<GetCommentDetailByIdQuery, GetCommentDetailByIdResult>
    {
        private readonly ICommentRepository _repository;

        public GetCommentDetailByIdHandler(ICommentRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetCommentDetailByIdResult> Handle(GetCommentDetailByIdQuery query, CancellationToken cancellationToken)
        {
            var comment = await _repository.GetByIdDetailAsync(query.Id);

            if (comment == null)
            {
                return new GetCommentDetailByIdResult(null);
            }

            var commentDto = comment?.ToCommentDetailDto();

            return new GetCommentDetailByIdResult(commentDto);
        }
    }
}



