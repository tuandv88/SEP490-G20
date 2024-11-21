namespace Community.Application.Models.Votes.Dtos;

public record CreateVoteDto(
    Guid? DiscussionId,                  // ID của thảo luận (nếu vote cho thảo luận)
    Guid? CommentId,                     // ID của bình luận (nếu vote cho bình luận)
    string VoteType,                     // Kiểu vote (Like hoặc Dislike)
    string DateVoted ,                   // Ngày vote 
    bool IsActive                        // Trạng thái của vote
);
