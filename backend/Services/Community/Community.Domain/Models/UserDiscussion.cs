using Community.Domain.ValueObjects;

namespace Community.Domain.Models
{
    public class UserDiscussion : Aggregate<UserDiscussionId>
    {
        public UserId UserId { get; set; } = default!;                     // ID của người dùng
        public DiscussionId DiscussionId { get; set; } = default!;         // ID của thảo luận
        public bool IsFollowing { get; set; } = false;                     // Trạng thái theo dõi thảo luận
        public DateTime? DateFollowed { get; set; } = null;                // Ngày bắt đầu theo dõi (có thể null)
        public DateTime? LastViewed { get; set; } = null;                  // Thời gian người dùng xem thảo luận gần nhất
        public bool NotificationsEnabled { get; set; } = false;            // Trạng thái nhận thông báo cho thảo luận

        public static UserDiscussion Create(UserId userId, DiscussionId discussionId)
        {
            UserDiscussion userDiscussionNew = new UserDiscussion()
            {
                Id = UserDiscussionId.Of(Guid.NewGuid()),
                UserId = userId,
                DiscussionId = discussionId,
                IsFollowing = true,
                DateFollowed = DateTime.UtcNow,
                LastViewed = DateTime.UtcNow,
                NotificationsEnabled = true
            };

            return userDiscussionNew;
        }
    }
}
