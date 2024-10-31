using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Queries.GetCategories;

// Định nghĩa kết quả trả về dạng List - Tất cả Categories
public record GetCategoriesResult(List<CategoryDto> CategoryDtos);

// Get Query để lấy tất cả Categories (không phân trang) - Đã định nghĩa kiểu trả về bên trên.
public record GetCategoriesQuery : IQuery<GetCategoriesResult>;



