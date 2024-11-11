using Community.Domain.ValueObjects;

namespace Community.Application.Models.Bookmarks.Commands.RemoveBookmarkById;

public record RemoveBookmarkByIdResult(bool IsSuccess, string Message);

public record RemoveBookmarkByIdCommand(Guid BookmarkId) : ICommand<RemoveBookmarkByIdResult>;
