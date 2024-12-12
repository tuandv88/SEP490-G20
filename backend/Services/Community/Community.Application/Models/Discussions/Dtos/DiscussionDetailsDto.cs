namespace Community.Application.Models.Discussions.Dtos;
public record DiscussionDetailsDto(
Guid Id,
Guid UserId,                       // ID của người tạo thảo luận
Guid CategoryId,                   // ID của chuyên mục chứa thảo luận
string Title,                      // Tiêu đề thảo luận
string Description,                // Mô tả nội dung thảo luận
string? ImageUrl,                  // URL của ảnh thảo luận
long ViewCount,                    // Số lượt xem
long VoteCount,                    // Số lượng vote
long CommentCount,                 // Số lượng bình luận
bool IsActive,                     // Trạng thái hoạt động
List<string> Tags,                 // Tag của thảo luận
DateTime DateCreated,              // Thời gian tạo
DateTime DateUpdated,              // Thời gian cập nhật
bool Closed,                       // Đánh dấu nếu thảo luận đã đóng
bool Pinned,                       // Đánh dấu nếu thảo luận được ghim
bool EnableNotification
);

