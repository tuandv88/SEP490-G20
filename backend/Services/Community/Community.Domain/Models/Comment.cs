﻿namespace Community.Domain.Models
{
    public class Comment : Aggregate<CommentId>
    {
        public List<Vote> Votes { get; set; } = new();
        public UserId UserId { get; set; } = default!;                  // ID của người tạo thảo luận
        public DiscussionId DiscussionId { get; set; } = default!;      // ID của thảo luận chứa bình luận
        public string Content { get; set; } = default!;    // Nội dung bình luận
        public CommentId? ParentCommentId { get; set; }    // ID của bình luận cha (có thể null)
        public DateTime DateCreated { get; set; }          // Thời gian tạo bình luận
        public bool IsEdited { get; set; }                 // Đánh dấu nếu bình luận đã chỉnh sửa
        public int Depth { get; set; }                     // Độ sâu của bình luận (lồng nhau)
        public bool IsActive { get; set; } = true;         // Đánh dấu vote đã bị ẩn hay chưa

        // Phương thức khởi tạo một bình luận
        public static Comment Create(CommentId commentId, DiscussionId discussionId, UserId userId, string content, DateTime dateCreated, CommentId? parentCommentId = null, int depth = 0, bool isActive = true)
        {
            return new Comment
            {
                Id = commentId,
                DiscussionId = discussionId,
                UserId = userId,
                Content = content,
                ParentCommentId = parentCommentId,
                DateCreated = dateCreated,
                IsEdited = false,
                Depth = depth,
                IsActive = isActive
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
