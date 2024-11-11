namespace Community.Domain.Models
{
    public class Bookmark : Aggregate<BookmarkId>
    {
        public UserId UserId { get; set; } = default!;                   // ID của người dùng
        public DiscussionId DiscussionId { get; set; } = default!;       // ID của bài thảo luận được lưu
        public DateTime DateBookmarked { get; set; }                     // Ngày lưu bài

        // Phương thức khởi tạo một bookmark
        public static Bookmark Create(UserId userId, DiscussionId discussionId)
        {
            return new Bookmark
            {
                UserId = userId,
                DiscussionId = discussionId,
                DateBookmarked = DateTime.Now
            };
        }
    }
}
