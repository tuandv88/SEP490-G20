using Community.Application.Models.Bookmarks.Dtos;
using Community.Application.Models.Bookmarks.Queries.GetBookmarkById;

namespace Community.API.Endpoints.Bookmarks;
public record GetBookmarkByIdResponse(BookmarkDto BookmarkDto);
public class GetBookmarkByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/bookmark/{id:guid}", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetBookmarkByIdQuery(id));

            var response = result.Adapt<GetBookmarkByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetBookmarkById")
        .Produces<GetBookmarkByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Bookmark By Id");
    }
}
