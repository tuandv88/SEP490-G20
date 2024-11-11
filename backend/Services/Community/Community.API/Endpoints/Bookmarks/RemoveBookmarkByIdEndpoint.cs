using Community.Application.Models.Bookmarks.Commands.RemoveBookmarkById;

namespace Community.API.Endpoints.Bookmarks;

public class RemoveBookmarkByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/bookmarks/{bookmarkId:guid}", async (Guid bookmarkId, ISender sender) =>
        {
            var command = new RemoveBookmarkByIdCommand(bookmarkId);
            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = result.Message });
            }
            else
            {
                return Results.NotFound(new { Message = result.Message });
            }
        })
        .WithName("RemoveBookmarkById")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Remove a bookmark by its ID.");
    }
}
