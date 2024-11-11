using Community.Application.Extensions;
using Community.Application.Models.Categories.Queries.GetCategoryById;

namespace Community.Application.Models.Bookmarks.Queries.GetBookmarkById;

public class GetBookmarkByIdHandler : IQueryHandler<GetBookmarkByIdQuery, GetBookmarkByIdResult>
{
    private readonly IBookmarkRepository _repository;

    public GetBookmarkByIdHandler(IBookmarkRepository repository)
    {
        _repository = repository;
    }

    public async Task<GetBookmarkByIdResult> Handle(GetBookmarkByIdQuery query, CancellationToken cancellationToken)
    {
        var bookmark = await _repository.GetByIdAsync(query.Id);

        if (bookmark == null)
        {
            return new GetBookmarkByIdResult(null);
        }

        var bookmarkDto = bookmark.ToBookmarkDto();

        return new GetBookmarkByIdResult(bookmarkDto);
    }
}
