namespace Community.Application.Models.Discussions.Dtos;

public record DiscussionDto(
        string UserName,               // Tên người tạo thảo luận
        string UserAvatarUrl,          // URL hình đại diện của người tạo
        Guid CategoryId,               // CateId
        Guid UserId,               
        Guid Id,                       // ID của thảo luận
        string Title,                  // Tiêu đề thảo luận
        string Description,            // Mô tả nội dung thảo luận
        DateTime DateCreated,          // Thời gian tạo của thảo luận
        DateTime DateUpdated,          // Thời gian cập nhật gần nhất
        List<string> Tags,             // Danh sách tag của thảo luận
        bool Pinned,                   // Trạng thái ghim của thảo luận
        long ViewCount,                // Số lượt xem
        int VoteCount,                 // Số lượng vote
        int CommentCount,              // Số lượng bình luận
        bool Closed                    // Trạng thái đóng của thảo luận
    );