using Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public record ChangeCourseLevelRequest(string CourseLevel);
public record ChangeCourseLevelResponse(bool IsSuccess, string Message);
public class ChangeCourseLevelEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/courses/{CourseId}/change-level", async ([FromRoute] Guid CourseId, ChangeCourseLevelRequest request, ISender sender) =>
        {
            var result = await sender.Send(new ChangeCourseLevelCommand(CourseId, request.CourseLevel));

            var response = result.Adapt<ChangeCourseLevelResponse>();

            return Results.Ok(response);
        })
        .WithName("ChangeCourseLevel")
        .Produces<ChangeCourseLevelResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Change course level");
    }
}
