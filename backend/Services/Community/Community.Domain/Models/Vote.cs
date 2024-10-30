using Elastic.CommonSchema;

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

        // Phương thức khởi tạo một vote
        public static Vote Create(UserId userId, VoteType voteType, DateTime dateVoted, DiscussionId? discussionId = null, CommentId? commentId = null)
        {
            return new Vote
            {
                UserId = userId,
                VoteType = voteType,
                DateVoted = dateVoted,
                DiscussionId = discussionId,
                CommentId = commentId
            };
        }
    }
}
