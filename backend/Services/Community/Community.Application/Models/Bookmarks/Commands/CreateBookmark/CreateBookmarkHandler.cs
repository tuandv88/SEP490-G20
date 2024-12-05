using Community.Application.Interfaces;
using Community.Application.Models.Bookmarks.Commands.CreateBookmark;
using Community.Application.Models.Bookmarks.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Bookmarks.Commands.CreateBookmark;

public class CreateBookmarkHandler : ICommandHandler<CreateBookmarkCommand, CreateBookmarkResult>
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IUserContextService _userContextService;

    public CreateBookmarkHandler(IBookmarkRepository bookmarkRepository, IUserContextService userContextService)
    {
        _bookmarkRepository = bookmarkRepository;
        _userContextService = userContextService;
    }

    public async Task<CreateBookmarkResult> Handle(CreateBookmarkCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Lấy UserId từ UserContextService
            var currentUserId = _userContextService.User.Id;

            if (currentUserId == null)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            var userId = UserId.Of(currentUserId);


            var bookmark = await _bookmarkRepository.GetByIdDiscussionAndUserIdAsync(request.CreateBookmarkDto.DiscussionId, userId.Value);

            if( bookmark != null ) 
            {
                return new CreateBookmarkResult(bookmark.Id.Value, false);
            }

            var bookmarkNew = await CreateNewBookmark(request.CreateBookmarkDto, userId);

            await _bookmarkRepository.AddAsync(bookmarkNew);
            await _bookmarkRepository.SaveChangesAsync(cancellationToken);

            return new CreateBookmarkResult(bookmarkNew.Id.Value, true);
        }
        catch (Exception ex)
        {
            return new CreateBookmarkResult(null, false);
        }
    }

    private async Task<Bookmark> CreateNewBookmark(CreateBookmarkDto createBookmarkDto, UserId userId)
    {
        var discussionId = DiscussionId.Of(createBookmarkDto.DiscussionId);

        return Bookmark.Create(
            bookmarkId: BookmarkId.Of(Guid.NewGuid()),
            userId: userId,
            discussionId: discussionId
        );
    }
}
