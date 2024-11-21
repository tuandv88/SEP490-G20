using Learning.Application.Models.Chapters.Commands.UpdateChapter;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Chapters;
public record UpdateChapterRequest(UpdateChapterDto Chapter);
public record UpdateChapterResponse(bool IsSuccess);
public class UpdateChapterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/courses/{CourseId}/chapters/{ChapterId}", async (
            [FromRoute] Guid CourseId, [FromRoute] Guid ChapterId,
            UpdateChapterRequest request, ISender sender) =>
        {

            var result = await sender.Send(new UpdateChapterCommand(ChapterId, CourseId, request.Chapter));

            var response = result.Adapt<UpdateChapterResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateChapter")
        .Produces<UpdateChapterResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update chapter");
    }
}