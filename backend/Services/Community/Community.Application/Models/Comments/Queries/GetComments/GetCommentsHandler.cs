using Community.Application.Extensions;

namespace Community.Application.Models.Comments.Queries.GetComments;
public class GetCommentsHandler : IQueryHandler<GetCommentsQuery, GetCommentsResult>
{
    private readonly ICommentRepository _repository;

    public GetCommentsHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetCommentsResult> Handle(GetCommentsQuery query, CancellationToken cancellationToken)
    {
        var comments = await _repository.GetAllCommentDetailsAsync();

        var commentDtos = comments?.Select(c => c.ToCommentDto()).ToList();

        return new GetCommentsResult(commentDtos);
    }
}


