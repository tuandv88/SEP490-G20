namespace Community.Application.Models.Categories.Dtos
{
    public record UpdateCategoryDto(
        Guid Id,                  // ID của Category cần cập nhật
        string Name,              // Tên mới của chuyên mục
        string Description,       // Mô tả mới của chuyên mục
        bool IsActive             // Trạng thái hoạt động của chuyên mục
    );
}
