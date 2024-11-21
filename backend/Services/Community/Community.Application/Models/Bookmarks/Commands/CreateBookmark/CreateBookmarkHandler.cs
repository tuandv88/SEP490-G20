using Community.Application.Models.Bookmarks.Commands.CreateBookmark;
using Community.Application.Models.Bookmarks.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Bookmarks.Commands.CreateBookmark;

public class CreateBookmarkHandler : ICommandHandler<CreateBookmarkCommand, CreateBookmarkResult>
{
    private readonly IBookmarkRepository _bookmarkRepository;

    public CreateBookmarkHandler(IBookmarkRepository bookmarkRepository)
    {
        _bookmarkRepository = bookmarkRepository;
    }

    public async Task<CreateBookmarkResult> Handle(CreateBookmarkCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var bookmark = await CreateNewBookmark(request.CreateBookmarkDto);

            await _bookmarkRepository.AddAsync(bookmark);
            await _bookmarkRepository.SaveChangesAsync(cancellationToken);

            return new CreateBookmarkResult(bookmark.Id.Value, true);
        }
        catch (Exception ex)
        {
            return new CreateBookmarkResult(null, false);
        }
    }

    private async Task<Bookmark> CreateNewBookmark(CreateBookmarkDto createBookmarkDto)
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

        var discussionId = DiscussionId.Of(createBookmarkDto.DiscussionId);

        return Bookmark.Create(
            bookmarkId: BookmarkId.Of(Guid.NewGuid()),
            userId: userId,
            discussionId: discussionId
        );
    }
}
