namespace Community.Domain.Models
{
    public class Comment : Aggregate<CommentId>
    {
        public UserId UserId { get; set; } = default!;                  // ID của người tạo thảo luận
        public DiscussionId DiscussionId { get; set; } = default!;      // ID của thảo luận chứa bình luận
        public string Content { get; set; } = default!;    // Nội dung bình luận
        public CommentId? ParentCommentId { get; set; }    // ID của bình luận cha (có thể null)
        public DateTime DateCreated { get; set; }          // Thời gian tạo bình luận
        public bool IsEdited { get; set; }                 // Đánh dấu nếu bình luận đã chỉnh sửa
        public int Depth { get; set; }                     // Độ sâu của bình luận (lồng nhau)

        // Phương thức khởi tạo một bình luận
        public static Comment Create(DiscussionId discussionId, UserId userId, string content, CommentId? parentCommentId = null, int depth = 0)
        {
            return new Comment
            {
                DiscussionId = discussionId,
                UserId = userId,
                Content = content,
                ParentCommentId = parentCommentId,
                DateCreated = DateTime.Now,
                IsEdited = false,
                Depth = depth
            };
        }

        // Phương thức chỉnh sửa nội dung bình luận
        public void EditContent(string newContent)
        {
            Content = newContent;
            IsEdited = true;
        }
    }
}
