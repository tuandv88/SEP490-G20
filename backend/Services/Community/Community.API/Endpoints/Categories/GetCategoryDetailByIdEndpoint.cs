using Community.Application.Models.Categories.Dtos;
using Community.Application.Models.Categories.Queries.GetCategoryDetailById;
using Microsoft.AspNetCore.Mvc;
using Mapster;
using MediatR;

namespace Community.API.Endpoints.Categories;

// Định nghĩa Response bao gồm kết quả phân trang của CategoryDetailDto
public record GetCategoryDetailByIdResponse(PaginatedResult<CategoryDetailDto> CategoryDetailDto);

public class GetCategoryDetailByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/categories/{categoryId:guid}/details", async (Guid categoryId, [AsParameters] PaginationRequest request, string? orderBy, [FromQuery] string? tags, ISender sender) =>
        {
            // Gọi handler `GetCategoryDetailByIdHandler` bằng cách gửi `GetCategoryDetailByIdQuery`
            var result = await sender.Send(new GetCategoryDetailByIdQuery(categoryId, request, orderBy, tags));

            // Ánh xạ kết quả thành `GetCategoryDetailByIdResponse`
            var response = result.Adapt<GetCategoryDetailByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetCategoryDetailById")
        .Produces<GetCategoryDetailByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Category Details by CategoryId, including Discussions with Pagination, Sorting, and Tag Filtering.");
    }
}
