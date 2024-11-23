using Learning.Application.Models.Lectures.Commands.CreateLectureComment;
using Learning.Application.Models.Lectures.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;

public record CreateLectureCommentRequest(CreateLectureCommentDto Comment);
public record CreateLectureCommentResponse(Guid Id);
public class CreateLectureCommentEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/courses/{CourseId}/lectures/{LectureId}/comments", async ([FromRoute] Guid CourseId, [FromRoute] Guid LectureId,
            CreateLectureCommentRequest request, ISender sender) => {
                var command = new CreateLectureCommentCommand(CourseId, LectureId, request.Comment);

                var result = await sender.Send(command);

                var response = result.Adapt<CreateLectureCommentResponse>();

                return Results.Created($"/courses/{CourseId}/lectures/{LectureId}/{response.Id}", response);
            })
        .WithName("CreateLectureComment")
        .Produces<CreateLectureCommentResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create lecture comment");
    }
}
