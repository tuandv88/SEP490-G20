using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Discussions.Dtos;

public record DiscussionDetailUserDto(
    Guid CategoryId,            // ID của thảo luận
    string NameCategory,        // Mô tả nội dung thảo luận
    Guid DiscussionId,          // ID của thảo luận
    string Title,               // Tiêu đề thảo luận
    string Description,         // Mô tả nội dung thảo luận
   DateTime DateCreated,          // Thời gian tạo của thảo luận
    long ViewCount,             // Số lượt xem
    long VoteCount,             // Số lượt vote
    long CommentsCount,         // Số lượt bình luận
    bool IsActive,              // Trạng thái hoạt động của thảo luận
    List<string> Tags,          // Tags của thảo luận
    bool NotificationsEnabled,  // Trạng thái thông báo của thảo luận
    Guid FlagId,                // ID của thảo luận
    DateTime FlaggedDate,       // Ngày bị báo cáo
    ViolationLevel ViolationLevel = ViolationLevel.None, // Mức độ vi phạm
    string Reason = ""          // Lý do vi phạm
);



