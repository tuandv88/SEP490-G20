using Community.Application.Models.Bookmarks.Dtos;

namespace Community.Application.Models.Bookmarks.Queries.GetBookmarkById;
public record GetBookmarkByIdResult(BookmarkDto BookmarkDto);
public record GetBookmarkByIdQuery(Guid Id) : IQuery<GetBookmarkByIdResult>;
