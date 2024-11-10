using Community.Application.Models.Categories.Queries.GetCategoryById;

namespace Community.API.Endpoints.Categories;
public record GetCategoryByIdResponse(CategoryDto CategoryDto);
public class GetCategoryByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/category/{id:guid}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetCategoryByIdQuery(id));

            var response = result.Adapt<GetCategoryByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetCategoryById")
        .Produces<GetCategoryByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Category By Id");
    }
}
