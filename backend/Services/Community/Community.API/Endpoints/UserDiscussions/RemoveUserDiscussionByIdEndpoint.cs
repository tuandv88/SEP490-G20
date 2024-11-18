using Community.Application.Models.UserDiscussions.Commands.RemoveUserDiscussionById;

namespace Community.API.Endpoints.UserDiscussions;

public class RemoveUserDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/userdiscussions/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveUserDiscussionByIdCommand(id);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = result.Message, DeletedId = result.Id });
            }
            else
            {
                return Results.NotFound(new { Message = result.Message });
            }
        })
        .WithName("RemoveUserDiscussionById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a UserDiscussion by its ID.");
    }
}
