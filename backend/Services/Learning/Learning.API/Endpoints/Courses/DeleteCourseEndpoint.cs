using Learning.Application.Models.Courses.Commands.DeleteCourse;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public class DeleteCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapDelete("/courses/{CourseId}", async ([FromRoute] Guid CourseId, ISender sender) => {
            var result = await sender.Send(new DeleteCourseCommand(CourseId));

            return Results.NoContent();
        })
        .WithName("DeleteCourse")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Delete course");
    }
}