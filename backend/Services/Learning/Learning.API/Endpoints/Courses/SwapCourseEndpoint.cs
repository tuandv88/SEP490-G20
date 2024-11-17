using Learning.Application.Models.Courses.Commands.SwapCourse;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;

public record SwapCourseResponse(int OrderIndexCourse1, int OrderIndexCourse2);
public class SwapCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses/swap/{CourseId1}/{CourseId2}", async ([FromRoute] Guid CourseId1, [FromRoute] Guid CourseId2, ISender sender) => {
            var result = await sender.Send(new SwapCourseCommand(CourseId1, CourseId2));

            var response = result.Adapt<SwapCourseResponse>();

            return Results.Ok(response);
        })
        .WithName("SwapCourse")
        .Produces<SwapCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Swap course");
    }
}