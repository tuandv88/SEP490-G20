namespace Community.Application.Models.Categories.Dtos;

public record CreateCategoryDto(
        string Name,             // Tên chuyên mục
        string Description,      // Mô tả chuyên mục
        bool IsActive            // Trạng thái hoạt động của chuyên mục
);