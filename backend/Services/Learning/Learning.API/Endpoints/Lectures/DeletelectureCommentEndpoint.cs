using Learning.Application.Models.Lectures.Commands.DeleteLectureComment;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public class DeletelectureCommentEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/courses/{CourseId}/lectures/{LectureId}/comments/{LectureCommentId}", async (
            [FromRoute] Guid CourseId, [FromRoute] Guid LectureId, [FromRoute] Guid LectureCommentId,
            ISender sender) => {

            await sender.Send(new DeleteLectureCommentCommand(CourseId, LectureId, LectureCommentId));

            return Results.NoContent();
        })
       .WithName("DeletelectureComment")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete Lecture comment");
    }
}
