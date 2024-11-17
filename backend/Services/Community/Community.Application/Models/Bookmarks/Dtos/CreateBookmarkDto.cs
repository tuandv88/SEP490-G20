namespace Community.Application.Models.Bookmarks.Dtos;

public record CreateBookmarkDto(
    Guid DiscussionId                  // ID của thảo luận
);
