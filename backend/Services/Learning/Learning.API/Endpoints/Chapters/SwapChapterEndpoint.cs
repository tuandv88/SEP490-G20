using Learning.Application.Models.Chapters.Commands.SwapChapter;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Chapters;

public record SwapChapterResponse(int OrderIndexChapter1, int OrderIndexChapter2);
public class SwapChapterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/chapters/swap/{ChapterId1}/{ChapterId2}", async ([FromRoute] Guid ChapterId1, [FromRoute] Guid ChapterId2, ISender sender) =>
        {
            var result = await sender.Send(new SwapChapterCommand(ChapterId1, ChapterId2));

            var response = result.Adapt<SwapChapterResponse>();

            return Results.Ok(response);
        })
        .WithName("SwapChapter")
        .Produces<SwapChapterResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Swap chapter");
    }
}