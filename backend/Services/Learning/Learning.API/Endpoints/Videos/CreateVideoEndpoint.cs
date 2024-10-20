using Learning.Application.Models.Courses.Commands.CreateCourse;

namespace Learning.API.Endpoints.Videos;


public record CreateVideoRequest(IFormFile File);
public record CreateVideoResponse(Guid Id);
public class CreateVideoEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/videos", async (CreateVideoRequest request, ISender sender) => {
            var command = request.Adapt<CreateCourseCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateVideoResponse>();

            return Results.Created($"/videos/{response.Id}", response);
        })
        .WithName("CreateVideo")
        .Produces<CreateCourseResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create video");
    }
}

