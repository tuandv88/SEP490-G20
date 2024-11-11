using Community.Application.Models.Bookmarks.Dtos;
using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Bookmarks.Queries.GetBookmarks;

public record GetBookmarksResult(List<BookmarkDto> BookmarkDtos);

public record GetBookmarksQuery : IQuery<GetBookmarksResult>;
