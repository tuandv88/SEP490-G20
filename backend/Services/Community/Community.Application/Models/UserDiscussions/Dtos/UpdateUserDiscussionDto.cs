namespace Community.Application.Models.UserDiscussions.Dtos;

public record UpdateUserDiscussionDto(
    Guid Id,                        // ID của UserDiscussion cần cập nhật
    bool IsFollowing,               // Trạng thái theo dõi thảo luận
    DateTime? DateFollowed,         // Ngày bắt đầu theo dõi (có thể null)
    DateTime? LastViewed,           // Thời gian người dùng xem thảo luận gần nhất
    bool NotificationsEnabled       // Trạng thái nhận thông báo cho thảo luận
);