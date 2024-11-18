using Community.Application.Models.Bookmarks.Commands.CreateBookmark;
using Community.Application.Models.Bookmarks.Dtos;

namespace Community.API.Endpoints.Bookmarks;

public class CreateBookmarkEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/bookmarks", async (CreateBookmarkDto createBookmarkDto, ISender sender) =>
        {
            var command = new CreateBookmarkCommand(createBookmarkDto);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Created($"Id: {result.Id}", new { Message = "Bookmark created successfully", BookmarkId = result.Id });
            }
            else
            {
                return Results.BadRequest(new { Message = "Bookmark creation failed" });
            }
        })
        .WithName("CreateBookmark")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a new bookmark.");
    }
}
