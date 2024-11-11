using Community.Application.Models.Comments.Commands.UpdateStatusComment;

namespace Community.API.Endpoints.Comments;

public class UpdateStatusCommentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/comment/{Id:guid}/update-status", async (Guid Id, ISender sender) =>
        {
            var command = new UpdateStatusCommentCommand(Id);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Update Status Comment successfully", NewStatus = result.NewStatus });
            }
            else
            {
                return Results.BadRequest(new { Message = "Update Failed Status Comment." });
            }
        })
        .WithName("UpdateStatusComment")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update IsActive status of a comment.");
    }
}
