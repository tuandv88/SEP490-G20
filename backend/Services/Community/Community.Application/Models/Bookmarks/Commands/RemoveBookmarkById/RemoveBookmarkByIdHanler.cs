using Community.Application.Models.Bookmarks.Commands.RemoveBookmarkById;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Bookmarks.Commands.RemoveBookmarkById;

public class RemoveBookmarkByIdHandler : ICommandHandler<RemoveBookmarkByIdCommand, RemoveBookmarkByIdResult>
{
    private readonly IBookmarkRepository _bookmarkRepository;

    public RemoveBookmarkByIdHandler(IBookmarkRepository bookmarkRepository)
    {
        _bookmarkRepository = bookmarkRepository;
    }

    public async Task<RemoveBookmarkByIdResult> Handle(RemoveBookmarkByIdCommand request, CancellationToken cancellationToken)
    {
        var bookmark = await _bookmarkRepository.GetByIdAsync(request.BookmarkId);

        if (bookmark == null)
        {
            return new RemoveBookmarkByIdResult(false, "Bookmark not found.");
        }

        await _bookmarkRepository.DeleteByIdAsync(request.BookmarkId);
        await _bookmarkRepository.SaveChangesAsync(cancellationToken);

        return new RemoveBookmarkByIdResult(true, "Bookmark removed successfully.");
    }
}
