namespace Community.Application.Models.Bookmarks.Dtos;

public record CreateBookmarkDto(
    Guid UserId,                       // ID của người dùng
    Guid DiscussionId                  // ID của thảo luận
);
