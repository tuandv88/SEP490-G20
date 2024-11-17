using Learning.Application.Models.Lectures.Commands.DeleteLecture;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public class DeleteLectureEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/chapters/{ChapterId}/lectures/{LectureId}", async ([FromRoute] Guid ChapterId, [FromRoute] Guid LectureId, ISender sender) => {

            await sender.Send(new DeleteLectureCommand(ChapterId, LectureId));

            return Results.NoContent();
        })
       .WithName("Deletelecture")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete Lecture");
    }
}
