using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategories;

namespace Community.API.Endpoints.Categories;

public record GetCategoriesResponse(List<CategoryDto> Categories);          // Định nghĩa kiểu dữ liệu trả về GetCategoriesResponse, chứa danh sách các CategoryDto

public class GetCategoriesEndpoint : ICarterModule                          // Lớp GetCategoriesEndpoint implement ICarterModule để đăng ký các endpoint
{
    public void AddRoutes(IEndpointRouteBuilder app)                        // Phương thức AddRoutes định nghĩa các route cho endpoint
    {
        app.MapGet("/categories", async (ISender sender) =>                 // Đăng ký route GET cho endpoint /categories
        {
            // Gửi yêu cầu GetCategoriesQuery để lấy tất cả Categories
            var result = await sender.Send(new GetCategoriesQuery());

            // Chuyển đổi kết quả thành GetCategoriesResponse
            var response = result.Adapt<GetCategoriesResponse>();

            return Results.Ok(response);                                    // Trả về kết quả thành công (Status 200) với response dưới dạng JSON
        })
        .WithName("GetCategories")                                          // Đặt tên cho endpoint là "GetCategories" để dễ quản lý
        .Produces<GetCategoriesResponse>(StatusCodes.Status200OK)           // Xác định rằng endpoint sẽ trả về Status200OK với kiểu GetCategoriesResponse nếu thành công
        .ProducesProblem(StatusCodes.Status400BadRequest)                   // Xác định rằng endpoint có thể trả về lỗi 400 nếu yêu cầu không hợp lệ
        .ProducesProblem(StatusCodes.Status404NotFound)                     // Xác định rằng endpoint có thể trả về lỗi 404 nếu không tìm thấy dữ liệu
        .WithSummary("Get all Categories");                                 // Thêm mô tả tóm tắt cho endpoint: lấy tất cả danh mục
    }
}


// Khi gửi GetCategoriesQuery thông qua MediatR (như với sender.Send(new GetCategoriesQuery())),
// -> MediatR sẽ tự động tìm và gọi GetCategoriesHandler để xử lý GetCategoriesQuery.
// -> Còn GetCategoriesHandler sẽ tự động inject Interface thao tác với Categories - Đã được implement ở Infrastructe