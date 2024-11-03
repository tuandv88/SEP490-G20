using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetComments;

    public record GetCommentsResult(List<CommentDto> CommentDtos);

    public record GetCommentsQuery : IQuery<GetCommentsResult>;







