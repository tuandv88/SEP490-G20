using Community.Application.Models.Comments.Commands.RemoveCommentById;
using Community.Application.Models.Votes.Commands.RemoveVoteById;

namespace Community.API.Endpoints.Comments;

public class RemoveCommentByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/comments/{id:guid}", async (Guid id, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(new RemoveCommentByIdCommand(id), cancellationToken);

            if (result.IsSuccess)
            {
                return Results.Ok(new { result.Id, result.Message });
            }
            else
            {
                return Results.BadRequest(new { result.Id, result.Message });
            }
        })
        .WithName("RemoveCommentById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Remove a Comment by Id and return success or failure message.");
    }
}