using Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;
using Community.Application.Models.Discussions.Commands.UpdateStatusDiscussionById;

namespace Community.API.Endpoints.Discussions;

public class UpdatePinnedDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussion/{Id:guid}/update-pinned", async (Guid Id, ISender sender) =>
        {
            var command = new UpdatePinnedDiscussionByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Pinned Discussion successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Pinned Discussion." });
            }
        })
        .WithName("UpdatePinnedDiscussionById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Pinned of a Discussion.");
    }
}
