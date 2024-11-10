namespace Community.Domain.Models
{
    public class Vote : Aggregate<VoteId>
    {
        public DiscussionId? DiscussionId { get; set; }         // ID của thảo luận được vote (nếu là vote cho thảo luận)
        public Discussion? Discussion { get; set; }             // Tham chiếu đến thực thể Discussion (nếu là vote cho thảo luận)
        public CommentId? CommentId { get; set; }               // ID của bình luận được vote (nếu là vote cho bình luận)
        public Comment? Comment { get; set; }                   // Tham chiếu đến thực thể Comment (nếu là vote cho bình luận)

        public UserId UserId { get; set; } = default!;          // ID của người vote

        public VoteType VoteType { get; set; } = VoteType.Like; // Kiểu vote: like, dislike
        public DateTime DateVoted { get; set; }                 // Thời gian vote
        public bool IsActive { get; set; } = true;             // Đánh dấu vote đã bị ẩn hay chưa

        // Phương thức khởi tạo một vote
        public static Vote Create(UserId userId, VoteType voteType, DateTime dateVoted, DiscussionId? discussionId = null, CommentId? commentId = null, bool isActive = true)
        {
            return new Vote
            {
                UserId = userId,
                VoteType = voteType,
                DateVoted = dateVoted,
                DiscussionId = discussionId,
                CommentId = commentId,
                IsActive = isActive
            };
        }

        // Phương thức cập nhật vote
        public void Update(VoteType voteType, bool isActive, DateTime dateVoted)
        {
            VoteType = voteType;
            IsActive = isActive;
            DateVoted = dateVoted;

            // TODO: Add domain event to notify about the update, if needed
            // AddDomainEvent(new VoteUpdatedEvent(this));
        }
    }
}
