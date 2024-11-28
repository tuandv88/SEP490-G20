using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Dtos;

public record DiscussionsTopDto(
        Guid CategoryId,               // CateId
        Guid UserId,
        Guid Id,                       // ID của thảo luận
        string Title,                  // Tiêu đề thảo luận
        string Description,            // Mô tả nội dung thảo luận
        string ImageUrl,               // Url Img
        DateTime DateCreated,          // Thời gian tạo của thảo luận
        DateTime DateUpdated,          // Thời gian cập nhật gần nhất
        List<string> Tags,             // Danh sách tag của thảo luận
        bool Pinned,                   // Trạng thái ghim của thảo luận
        long ViewCount,                // Số lượt xem
        long VoteCount,                 // Số lượng vote
        long CommentCount,              // Số lượng bình luận
        bool Closed,                    // Trạng thái đóng của thảo luận
        bool EnableNotification,
        bool IsActive
);
