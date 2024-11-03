using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Votes.Dtos;
using Community.Application.Extensions;
using System.Collections.Generic;

namespace Community.Application.Extensions
{
    public static class CommentExtensions
    {
        public static CommentDto ToCommentDto(this Comment comment)
        {
            return new CommentDto(
                Id: comment.Id.Value,
                UserId: comment.UserId.Value,
                DiscussionId: comment.DiscussionId.Value,
                Content: comment.Content,
                ParentCommentId: comment.ParentCommentId?.Value,
                DateCreated: comment.DateCreated,
                IsEdited: comment.IsEdited,
                Depth: comment.Depth
            );
        }
        public static CommentDetailDto ToCommentDetailDto(this Comment comment)
        {
            return new CommentDetailDto(
                Id: comment.Id.Value,
                UserId: comment.UserId.Value,
                DiscussionId: comment.DiscussionId.Value,
                Content: comment.Content,
                ParentCommentId: comment.ParentCommentId?.Value,
                DateCreated: comment.DateCreated,
                IsEdited: comment.IsEdited,
                Depth: comment.Depth,
                Votes: comment.Votes.Select(vote => vote.ToVoteDto()).ToList()
            );
        }
    }
}
