namespace Community.Application.Models.Votes.Dtos;

public record UpdateVoteDto(
    Guid Id,                    // ID của vote cần cập nhật
    string VoteType,            // Loại vote, có thể là "Like" hoặc "Dislike"
    string DateVoted,           // Ngày vote (chuỗi để tiện xử lý định dạng)
    bool IsActive               // Trạng thái hoạt động của vote (ẩn/hiển)
);
