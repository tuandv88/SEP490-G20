namespace Community.Application.Models.Votes.Dtos;
public record VoteDto(
Guid Id,                         // ID của Vote
Guid UserId,                     // ID của người vote
Guid? DiscussionId,              // ID của thảo luận được vote (nếu là vote cho thảo luận)
Guid? CommentId,                 // ID của bình luận được vote (nếu là vote cho bình luận)
VoteType VoteType,               // Kiểu vote: like, dislike
DateTime DateVoted               // Thời gian vote
);
