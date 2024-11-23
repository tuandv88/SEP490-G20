using Learning.Application.Models.Lectures.Dtos;
using Learning.Application.Models.Lectures.Queries.GetLectureComment;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public record GetLectureCommentResponse(PaginatedResult<LectureCommentDto> Comments);
public class GetLectureCommentEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("lectures/{LectureId}/comments", async ([AsParameters] PaginationRequest request, 
            [FromRoute] Guid LectureId, ISender sender) => {
                var command = new GetLectureCommentQuery(request, LectureId);

                var result = await sender.Send(command);

                var response = result.Adapt<GetLectureCommentResponse>();

                return Results.Ok(response);
            })
        .WithName("GetLectureComment")
        .Produces<GetCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get lecture comment");
    }
}
