using Learning.Application.Models.Lectures.Commands.UpdateLecture;
using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public record UpdateLectureRequest(UpdateLectureDto Lecture);
public record UpdateLectureResponse(bool IsSuccess);
public class UpdateLectureEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/chapters/{ChapterId}/lectures/{LectureId}", async (
            [FromRoute] Guid ChapterId, [FromRoute] Guid LectureId,
            UpdateLectureRequest request, ISender sender) => {

                var result = await sender.Send(new UpdateLectureCommand(ChapterId, LectureId, request.Lecture));

                var response = result.Adapt<UpdateLectureResponse>();

                return Results.Ok(response);
            })
        .WithName("UpdateLecture")
        .Produces<UpdateLectureResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update lecture");
    }
}
