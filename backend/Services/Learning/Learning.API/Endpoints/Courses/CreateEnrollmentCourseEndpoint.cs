using Learning.Application.Models.Courses.Commands.CreateEnrollmentCourse;

namespace Learning.API.Endpoints.Courses;
public record CreateEnrollmentCourseResponse(bool IsSuccess);
public class CreateEnrollmentCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapPost("/courses/{Id}/enrollment/join", async (Guid Id, ISender sender) => {
            var result = await sender.Send(new CreateEnrollmentCourseCommand(Id));

            var response = result.Adapt<CreateEnrollmentCourseResponse>();

            return Results.Ok(response);

        })
        .WithName("CreateEnrollmentCourse")
        .Produces<CreateEnrollmentCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("create enrollment course info");
    }
}
