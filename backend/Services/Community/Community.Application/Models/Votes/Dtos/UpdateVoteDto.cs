namespace Community.Application.Models.Votes.Dtos;

public class UpdateVoteDto
{
    public Guid Id { get; set; }                     // ID của vote cần cập nhật
    public string VoteType { get; set; } = default!; // Loại vote, có thể là "Like" hoặc "Dislike"
    public string DateVoted { get; set; } = default!; // Ngày vote (chuỗi để tiện xử lý định dạng)
    public bool IsActive { get; set; }               // Trạng thái hoạt động của vote (ẩn/hiển)
}
