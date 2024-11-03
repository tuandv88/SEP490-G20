using Community.Application.Models.Votes.Dtos;
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
                DateVoted: vote.DateVoted
            );
        }
    }

}
