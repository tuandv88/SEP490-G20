using Community.Application.Extensions;
using Community.Application.Models.Categories.Queries.GetCategories;
namespace Community.Application.Models.Bookmarks.Queries.GetBookmarks;

public class GetBookmarksHandler : IQueryHandler<GetBookmarksQuery, GetBookmarksResult>
{
    private readonly IBookmarkRepository _repository;

    public GetBookmarksHandler(IBookmarkRepository repository) 
    {
        _repository = repository;
    }

    public async Task<GetBookmarksResult> Handle(GetBookmarksQuery query, CancellationToken cancellationToken)
    {
        var allBookmarks = await _repository.GetAllAsync();

        var bookmarkDtos = allBookmarks.Select(b => b.ToBookmarkDto()).ToList();

        return new GetBookmarksResult(bookmarkDtos);

    }
}