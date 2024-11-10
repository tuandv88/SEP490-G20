namespace Community.Application.Models.Comments.Dtos;

public record CreateCommentDto(
    Guid UserId,                    // ID của người tạo comment
    Guid DiscussionId,              // ID của thảo luận chứa comment
    string Content,                 // Nội dung của comment
    Guid? ParentCommentId = null,   // ID của comment cha (nếu có)
    int Depth = 0,                  // Độ sâu của comment (mặc định là 0)
    bool IsActive = true            // Trạng thái của comment
);
