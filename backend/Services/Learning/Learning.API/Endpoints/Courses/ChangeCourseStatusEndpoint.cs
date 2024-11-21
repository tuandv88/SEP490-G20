using Learning.Application.Models.Courses.Commands.ChangeCourseStatus;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public record ChangeCourseStatusRequest(string CourseStatus);
public record ChageCourseStatusResponse(bool IsSuccess, string Message);
public class ChangeCourseStatusEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPut("/courses/{CourseId}/change-status", async ([FromRoute] Guid CourseId, ChangeCourseStatusRequest request, ISender sender) =>
        {
            var result = await sender.Send(new ChangeCourseStatusCommand(CourseId, request.CourseStatus));

            var response = result.Adapt<ChageCourseStatusResponse>();

            return Results.Ok(response);
        })
        .WithName("ChangeCourseStatus")
        .Produces<ChageCourseStatusResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Change course status");
    }
}
