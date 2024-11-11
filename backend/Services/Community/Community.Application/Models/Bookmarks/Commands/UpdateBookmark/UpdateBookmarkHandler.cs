using Community.Application.Models.Bookmarks.Commands.UpdateBookmark;
using Community.Application.Models.Bookmarks.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Bookmarks.Commands.UpdateBookmark;

public class UpdateBookmarkHandler : ICommandHandler<UpdateBookmarkCommand, UpdateBookmarkResult>
{
    private readonly IBookmarkRepository _bookmarkRepository;

    public UpdateBookmarkHandler(IBookmarkRepository bookmarkRepository)
    {
        _bookmarkRepository = bookmarkRepository;
    }

    public async Task<UpdateBookmarkResult> Handle(UpdateBookmarkCommand request, CancellationToken cancellationToken)
    {
        var bookmark = await _bookmarkRepository.GetByIdAsync(request.UpdateBookmarkDto.Id);

        if (bookmark == null)
        {
            return new UpdateBookmarkResult(false, "Bookmark not found.");
        }

        UpdateBookmarkWithNewValues(bookmark, request.UpdateBookmarkDto);

        await _bookmarkRepository.UpdateAsync(bookmark);
        await _bookmarkRepository.SaveChangesAsync(cancellationToken);

        return new UpdateBookmarkResult(true, "Bookmark updated successfully.");
    }

    private void UpdateBookmarkWithNewValues(Bookmark bookmark, UpdateBookmarkDto updateBookmarkDto)
    {
        bookmark.UserId = UserId.Of(updateBookmarkDto.UserId);
        bookmark.DiscussionId = DiscussionId.Of(updateBookmarkDto.DiscussionId);
        bookmark.DateBookmarked = updateBookmarkDto.DateBookmarked;
    }
}
