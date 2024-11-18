namespace Community.Application.Models.Comments.Dtos;

public record UpdateCommentDto(
    Guid Id,                       // ID của comment cần cập nhật
    Guid UserId,                   // ID của người tạo comment
    Guid DiscussionId,             // ID của thảo luận chứa comment
    string Content,                // Nội dung mới của comment
    Guid? ParentCommentId,         // ID của comment cha (có thể null)
    bool IsActive,                 // Trạng thái hoạt động của comment (ẩn/hiển)
    int Depth                      // Độ sâu của comment (lồng nhau)
);
