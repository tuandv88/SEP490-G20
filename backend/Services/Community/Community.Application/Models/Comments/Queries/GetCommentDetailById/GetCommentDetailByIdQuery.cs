using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentDetailById;
    public record GetCommentDetailByIdResult(CommentDetailDto CommentDetailDto);

    public record GetCommentDetailByIdQuery(Guid Id) : IQuery<GetCommentDetailByIdResult>;

