using Learning.Application.Models.Courses.Commands.UpdateLectureProgress;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;

public record UpdateLectureProgressRequest(long Duration);
public record UpdateLectureProgressReponse(bool IsSuccess);
public class UpdateLectureProgressEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses/{CourseId}/progress/{LectureId}", async ([FromRoute] Guid CourseId, [FromRoute] Guid LectureId, UpdateLectureProgressRequest request, ISender sender) => {
            var result = await sender.Send(new UpdateLectureProgressCommand(CourseId, LectureId, request.Duration));

            var response = result.Adapt<UpdateLectureProgressReponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateLectureProgress")
        .Produces<UpdateLectureProgressReponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update lecture progress");
    }
}