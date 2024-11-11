using Community.Application.Models.Bookmarks.Commands.UpdateBookmark;
using Community.Application.Models.Bookmarks.Dtos;

namespace Community.API.Endpoints.Bookmarks;

public class UpdateBookmarkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/bookmarks", async (UpdateBookmarkDto updateBookmarkDto, ISender sender) =>
        {
            var command = new UpdateBookmarkCommand(updateBookmarkDto);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = result.Message });
            }
            else
            {
                return Results.BadRequest(new { Message = result.Message });
            }
        })
        .WithName("UpdateBookmark")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update an existing bookmark.");
    }
}
