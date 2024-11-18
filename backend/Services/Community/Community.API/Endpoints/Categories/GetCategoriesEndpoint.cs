using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategories;

namespace Community.API.Endpoints.Categories;
public record GetCategoriesResponse(List<CategoryDto> CategoryDtos);          // Định nghĩa kiểu dữ liệu trả về GetCategoriesResponse, chứa danh sách các CategoryDto

public class GetCategoriesEndpoint : ICarterModule                          // Lớp GetCategoriesEndpoint implement ICarterModule để đăng ký các endpoint
{
    public void AddRoutes(IEndpointRouteBuilder app)                        // Phương thức AddRoutes định nghĩa các route cho endpoint
    {
        app.MapGet("/categories", async (ISender sender) =>                 // Đăng ký route GET cho endpoint /categories
        {
            // Gửi yêu cầu GetCategoriesQuery để lấy tất cả Categories
            var result = await sender.Send(new GetCategoriesQuery());

            // Chuyển đổi kết quả thành GetCategoriesResponse
            // Chú ý: Khi sử dụng Adapt name GetCategoriesResult == name GetCategoriesResponse
            var response = result.Adapt<GetCategoriesResponse>();

            return Results.Ok(response);                                    
        })
        .WithName("GetCategories")                                          
        .Produces<GetCategoriesResponse>(StatusCodes.Status200OK)           
        .ProducesProblem(StatusCodes.Status400BadRequest)                   
        .ProducesProblem(StatusCodes.Status404NotFound)                   
        .WithSummary("Get all Categories");                               
    }
}


// Khi gửi GetCategoriesQuery thông qua MediatR (như với sender.Send(new GetCategoriesQuery())),
// -> MediatR sẽ tự động tìm và gọi GetCategoriesHandler để xử lý GetCategoriesQuery.
// -> Còn GetCategoriesHandler sẽ tự động inject Interface thao tác với Categories - Đã được implement ở Infrastructe