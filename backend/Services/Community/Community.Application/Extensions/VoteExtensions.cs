using Community.Application.Models.Votes.Dtos;
using Community.Domain.ValueObjects;
namespace Community.Application.Extensions
{
    public static class VoteExtensions
    {
        public static VoteDto ToVoteDto(this Vote vote)
        {
            return new VoteDto(
                Id: vote.Id.Value,
                UserId: vote.UserId.Value,
                DiscussionId: vote.DiscussionId?.Value,
                CommentId: vote.CommentId?.Value,
                VoteType: vote.VoteType,
                DateVoted: vote.DateVoted,
                IsActive: vote.IsActive
            );
        }

        // Phương thức kiểm tra nếu người dùng có thể bỏ phiếu hay không
        public static bool CanVoteDiscussion(Discussion discussion, UserId userId)
        {
            // Kiểm tra nếu người dùng đã bỏ phiếu cho thảo luận này chưa
            var existingVote = discussion.Votes.FirstOrDefault(v => v.UserId == userId);

            if (existingVote == null)
            {
                return true; // Người dùng chưa bỏ phiếu, có thể bỏ phiếu
            }

            // Nếu đã Like, không thể Like lại, chỉ có thể Dislike
            if (existingVote.VoteType == VoteType.Like)
            {
                return false; // Không thể Like lại, chỉ có thể Dislike
            }

            // Nếu đã Dislike, không thể Dislike lại, nhưng có thể Like lại
            return existingVote.VoteType == VoteType.Dislike;
        }

        public static void AddOrUpdateVote(Discussion discussion, UserId userId, VoteType voteType)
        {
            // Kiểm tra nếu người dùng đã bỏ phiếu
            var existingVote = discussion.Votes.FirstOrDefault(v => v.UserId == userId);

            if (existingVote == null)
            {
                // Nếu người dùng chưa bỏ phiếu, thêm phiếu bầu mới
                discussion.Votes.Add(new Vote
                {
                    DiscussionId = discussion.Id,
                    UserId = userId,
                    VoteType = voteType,
                    DateVoted = DateTime.UtcNow,
                    IsActive = true
                });
            }
            else
            {
                // Nếu đã bỏ phiếu, cập nhật phiếu bầu
                existingVote.VoteType = voteType; // Chỉ thay đổi VoteType
                existingVote.DateVoted = DateTime.UtcNow;
            }

            // Cập nhật tổng số lượng vote cho thảo luận
            //discussion.TotalVotes = CalculateTotalVotes(discussion);
        }

        public static int CalculateTotalVotes(Discussion discussion)
        {
            // Tính tổng số votes từ danh sách phiếu bầu
            return discussion.Votes.Where(v => v.IsActive).Sum(v => v.VoteType == VoteType.Like ? 1 : -1);
        }

    }

}
