using Learning.Application.Models.Courses.Commands.UpdateCourse;

namespace Learning.API.Endpoints.Courses;
public record UpdateCourseRequest(UpdateCourseDto UpdateCourseDto);
public record UpdateCourseResponse(bool IsSuccess);
public class UpdateCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/courses", async (UpdateCourseRequest request, ISender sender) => {
            var command = request.Adapt<UpdateCourseCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateCourseResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateCourse")
        .Produces<UpdateCourseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update course");
    }
}
