using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Queries.GetCategories;


// Query để lấy tất cả Categories (không phân trang)
public record GetCategoriesQuery : IQuery<GetCategoriesResult>;

// Kết quả trả về của GetCategoriesQuery bao gồm danh sách tất cả Categories
public record GetCategoriesResult(List<CategoryDto> CategoryDtos);


