using Community.Application.Models.Discussions.Commands.UpdateStatusDiscussionById;

namespace Community.API.Endpoints.Discussions;

public class UpdateStatusDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussion/{Id:guid}/update-status", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateStatusDiscussionByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Discussion successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Discussion." });
            }
        })
        .WithName("UpdateStatusDiscussionById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update IsActive status of a Discussion.");
    }
}