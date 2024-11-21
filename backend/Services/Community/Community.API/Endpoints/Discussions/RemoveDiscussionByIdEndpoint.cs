using Community.Application.Models.Discussions.Commands.RemoveDiscussionById;

namespace Community.API.Endpoints.Discussions;
public class RemoveDiscussionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/discussions/{id:guid}/remove", async (Guid id, ISender sender) =>
        {
            var command = new RemoveDiscussionByIdCommand(id);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = $"Remove Discussion Id: {id} - Successfully!" });
            }
            else
            {
                return Results.NotFound(new { Message = $"Remove Discussion Id: {id} -  Failed!" });
            }
        })
        .WithName("RemoveDiscussionById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a Discussion by its ID.");
    }
}