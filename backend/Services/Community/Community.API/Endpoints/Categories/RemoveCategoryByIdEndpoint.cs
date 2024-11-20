using Community.Application.Models.Categories.Commands.RemoveCategoryById;

namespace Community.API.Endpoints.Categories;

public class RemoveCategoryByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/categories/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveCategoryByIdCommand(id);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = $"Remove Category Id: {id} - Successfully!" });
            }
            else
            {
                return Results.NotFound(new { Message = $"Remove Category Id: {id} -  Failed!" });
            }
        })
        .WithName("RemoveCategoryById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a Category by its ID.");
    }
}
