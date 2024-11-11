using Community.Application.Models.Bookmarks.Dtos;
using Community.Application.Models.Bookmarks.Queries.GetBookmarks;

namespace Community.API.Endpoints.Bookmarks;

public record GetBookmarksResponse(List<BookmarkDto> BookmarkDtos);

public class GetBookmarksEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/bookmarks", async (ISender sender) =>
        {
            var result = await sender.Send(new GetBookmarksQuery());

            var response = result.Adapt<GetBookmarksResponse>();

            return Results.Ok(response);
        })
        .WithName("GetBookmarks")
        .Produces<GetBookmarksResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Bookmarks");
    }
}
