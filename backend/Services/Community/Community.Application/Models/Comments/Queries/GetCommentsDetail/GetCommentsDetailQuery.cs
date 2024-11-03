using Community.Application.Models.Comments.Dtos;

namespace Community.Application.Models.Comments.Queries.GetCommentsDetail;

public record GetCommentsDetailResult(List<CommentDetailDto> CommentDetailDtos);

    public record GetCommentsDetailQuery : IQuery<GetCommentsDetailResult>;







