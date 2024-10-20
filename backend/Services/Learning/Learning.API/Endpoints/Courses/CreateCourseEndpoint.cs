using Learning.Application.Models.Courses.Commands.CreateCourse;

namespace Learning.API.Endpoints.Courses;
public record CreateCourseRequest(CreateCourseDto CreateCourseDto);
public record CreateCourseResponse(Guid Id);
public class CreateCourseEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/courses", async (CreateCourseRequest request, ISender sender) => {
            var command = request.Adapt<CreateCourseCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateCourseResponse>();

            return Results.Created($"/courses/{response.Id}", response);
        })
        .WithName("CreateCourse")
        .Produces<CreateCourseResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create course");
    }
}

