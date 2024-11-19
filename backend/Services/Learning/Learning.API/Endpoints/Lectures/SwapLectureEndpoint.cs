using Learning.Application.Models.Lectures.Commands.SwapLecture;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Lectures;
public record SwapLectureResponse(int OrderIndexLecture1, int OrderIndexLecture2);
public class SwapLectureEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/lectures/swap/{LectureId1}/{LectureId2}", async ([FromRoute] Guid LectureId1, [FromRoute] Guid LectureId2, ISender sender) =>
        {
            var result = await sender.Send(new SwapLectureCommand(LectureId1, LectureId2));

            var response = result.Adapt<SwapLectureResponse>();

            return Results.Ok(response);
        })
        .WithName("SwapLecture")
        .Produces<SwapLectureResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Swap lecture");
    }
}
