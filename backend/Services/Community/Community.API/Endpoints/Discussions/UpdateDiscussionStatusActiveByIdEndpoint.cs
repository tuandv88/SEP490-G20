using Community.Application.Models.Discussions.Commands.UpdateDiscussionStatusActiveById;

namespace Community.API.Endpoints.Discussions;

public class UpdateDiscussionStatusActiveByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussions/{Id:guid}/update-status-active", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateDiscussionStatusActiveByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Active Discussion successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Active Discussion." });
            }
        })
        .WithName("UpdateDiscussionStatusActiveById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Active Status of a Discussion.");
    }
}