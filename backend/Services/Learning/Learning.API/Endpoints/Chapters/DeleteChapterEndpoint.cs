using Learning.Application.Models.Chapters.Commands.DeleteChapter;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Chapters;
public class DeleteChapterEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/courses/{CourseId}/chapters/{ChapterId}", async (
            [FromRoute] Guid CourseId, [FromRoute] Guid ChapterId, ISender sender) => {

            await sender.Send(new DeleteChapterCommand(CourseId, ChapterId));
            return Results.NoContent();
        })
       .WithName("DeleteChapter")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete chapter");
    }
}
