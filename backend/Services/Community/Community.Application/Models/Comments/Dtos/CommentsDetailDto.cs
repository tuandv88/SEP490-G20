﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Comments.Dtos;

public record CommentsDetailDto(
    Guid Id,                      // ID của bình luận
    Guid UserId,                  // ID của người tạo bình luận
    Guid DiscussionId,            // ID của thảo luận chứa bình luận
    string Content,               // Nội dung bình luận
    Guid? ParentCommentId,        // ID của bình luận cha (có thể null)
    DateTime DateCreated,         // Thời gian tạo bình luận
    bool IsEdited,                // Đánh dấu nếu bình luận đã chỉnh sửa
    int Depth,                    // Độ sâu của bình luận (lồng nhau)
    bool IsActive,
    long TotalVote
);