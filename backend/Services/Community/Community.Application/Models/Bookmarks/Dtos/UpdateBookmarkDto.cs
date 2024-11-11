namespace Community.Application.Models.Bookmarks.Dtos;

public record UpdateBookmarkDto(
    Guid Id,                            // ID của bookmark cần cập nhật
    Guid UserId,                        // ID của người dùng
    Guid DiscussionId,                  // ID của thảo luận
    DateTime DateBookmarked             // Ngày lưu bookmark
);
