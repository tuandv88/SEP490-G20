namespace Community.Application.Models.Discussions.Dtos;

public record CreateDiscussionDto(
    Guid CategoryId,                       // ID của chuyên mục
    string Title,                          // Tiêu đề thảo luận
    string Description,                    // Mô tả nội dung
    List<string> Tags,                     // Danh sách tags
    ImageDto? Image,                       // Thông tin ảnh (nếu có)
    bool IsActive                          // Trạng thái hoạt động
);

public record ImageDto(
    string FileName,                       // Tên file ảnh
    string Base64Image,                    // Nội dung ảnh ở định dạng Base64
    string ContentType                     // Loại nội dung của ảnh
);
