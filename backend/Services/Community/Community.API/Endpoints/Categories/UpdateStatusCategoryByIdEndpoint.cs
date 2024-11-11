using Community.Application.Models.Categories.Commands.UpdateStatusCategoryById;

namespace Community.API.Endpoints.Categories;

public class UpdateStatusCategoryByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/categories/{Id:guid}/update-status", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateStatusCategoryByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Category successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Category." });
            }
        })
        .WithName("UpdateStatusCategoryById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update IsActive status of a Category By Id.");
    }
}