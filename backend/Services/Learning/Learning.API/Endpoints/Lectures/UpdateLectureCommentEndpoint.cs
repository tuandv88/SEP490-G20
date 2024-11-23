using Learning.Application.Models.Lectures.Commands.UpdateLectureComment;
using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public record UpdateLectureCommentRequest(UpdateLectureCommentDto Comment);
public record UpdateLectureCommentResponse(bool IsSuccess);
public class UpdateLectureCommentEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses/{CourseId}/lectures/{LectureId}/comments/{LectureCommentId}", async (
            [FromRoute] Guid CourseId, [FromRoute] Guid LectureId, [FromRoute] Guid LectureCommentId,
            UpdateLectureCommentRequest request, ISender sender) => {

                var command = new UpdateLectureCommentCommand(CourseId, LectureId, LectureCommentId, request.Comment);

                var result = await sender.Send(command);

                var response = result.Adapt<UpdateLectureCommentResponse>();

                return Results.Ok(response);
            })
        .WithName("UpdateLectureComment")
        .Produces<UpdateLectureCommentResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update lecture comment");
    }
}