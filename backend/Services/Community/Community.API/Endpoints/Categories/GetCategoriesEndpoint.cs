using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategories;
using Carter;
using Mapster;

namespace Community.API.Endpoints.Categories;

public record GetCategoriesResponse(List<CategoryDto> Categories);

public class GetCategoriesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/categories", async (ISender sender) =>
        {
            // Gửi yêu cầu GetCategoriesQuery để lấy tất cả Categories
            var result = await sender.Send(new GetCategoriesQuery());

            // Chuyển đổi kết quả thành GetCategoriesResponse
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
