using Learning.Application.Models.Courses.Queries.GetCourseProgress;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Courses;
public record GetCourseProgressReponse(List<CourseProgressDto> Progress);
public class GetCourseProgressEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/courses/{CourseId}/progress", async ([FromRoute] Guid CourseId, ISender sender) => {
            var result = await sender.Send(new GetCourseProgressQuery(CourseId));

            var response = result.Adapt<GetCourseProgressReponse>();

            return Results.Ok(response);

        })
        .WithName("GetCoursePrgress")
        .Produces<GetCourseProgressReponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Course Progress");
    }
}

