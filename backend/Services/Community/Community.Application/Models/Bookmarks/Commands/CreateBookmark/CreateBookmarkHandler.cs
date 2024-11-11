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
        // Convert `Guid` to `UserId` and `DiscussionId`
        var userId = UserId.Of(createBookmarkDto.UserId);
        var discussionId = DiscussionId.Of(createBookmarkDto.DiscussionId);

        return Bookmark.Create(
            bookmarkId: BookmarkId.Of(Guid.NewGuid()),
            userId: userId,
            discussionId: discussionId
        );
    }
}
