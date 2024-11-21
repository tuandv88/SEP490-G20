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
        // Dữ liệu test UserId
        var userContextTest = "c3d4e5f6-a7b8-9012-3456-789abcdef010";

        if (!Guid.TryParse(userContextTest, out var currentUserIdTest))
        {
            throw new UnauthorizedAccessException("Invalid user ID.");
        }

        var userId = UserId.Of(currentUserIdTest);

        // Lấy UserId từ UserContextService
        //var currentUserId = _userContextService.User.Id;

        //if (currentUserId == null)
        //{
        //    throw new UnauthorizedAccessException("User is not authenticated.");
        //}

        //var userId = UserId.Of(currentUserId.Value);

        bookmark.DiscussionId = DiscussionId.Of(updateBookmarkDto.DiscussionId);
        bookmark.DateBookmarked = updateBookmarkDto.DateBookmarked;
    }
}
