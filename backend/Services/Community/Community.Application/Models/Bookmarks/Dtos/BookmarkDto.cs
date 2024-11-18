namespace Community.Application.Models.Bookmarks.Dtos;

public record BookmarkDto(
Guid Id,                           // ID của Bookmark
Guid UserId,                       // ID của người dùng
Guid DiscussionId,                 // ID của bài thảo luận được lưu
DateTime DateBookmarked            // Thời gian lưu bookmark
);
