using Community.Application.Models.Votes.Dtos;

namespace Community.Application.Models.Comments.Dtos;
public record CommentDto(
    Guid Id,                      // ID của bình luận
    Guid UserId,                  // ID của người tạo bình luận
    Guid DiscussionId,            // ID của thảo luận chứa bình luận
    string Content,               // Nội dung bình luận
    Guid? ParentCommentId,        // ID của bình luận cha (có thể null)
    DateTime DateCreated,         // Thời gian tạo bình luận
    bool IsEdited,                // Đánh dấu nếu bình luận đã chỉnh sửa
    int Depth,                    // Độ sâu của bình luận (lồng nhau)
    List<VoteDto> Votes           // Danh sách các vote liên quan đến bình luận
);