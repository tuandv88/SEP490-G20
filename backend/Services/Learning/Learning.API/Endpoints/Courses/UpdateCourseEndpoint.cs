using Learning.Application.Models.Courses.Commands.UpdateCourse;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public record UpdateCourseRequest(UpdateCourseDto UpdateCourseDto);
public record UpdateCourseResponse(bool IsSuccess);
public class UpdateCourseEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/courses/{CourseId}", async ([FromRoute] Guid CourseId, UpdateCourseRequest request, ISender sender) =>
        {
            var result = await sender.Send(new UpdateCourseCommand(CourseId, request.UpdateCourseDto));

            var response = result.Adapt<UpdateCourseResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateCourse")
        .Produces<UpdateCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update course");
    }
}
