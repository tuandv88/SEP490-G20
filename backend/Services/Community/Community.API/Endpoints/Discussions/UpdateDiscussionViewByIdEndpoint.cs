using Community.Application.Models.Discussions.Commands.UpdateDiscussionViewById;
using Community.Application.Models.Discussions.Commands.UpdatePinnedDiscussionById;

namespace Community.API.Endpoints.Discussions;

public class UpdateDiscussionViewByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussion/{Id:guid}/updateview", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateDiscussionViewByIdCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update View Discussion successfully", CurrentTotalView = result.viewCount });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed View Discussion." });
            }
        })
        .WithName("UpdateDiscussionViewById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update View of a Discussion.");
    }
}
