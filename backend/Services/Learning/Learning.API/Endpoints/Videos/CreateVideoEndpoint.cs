using Learning.Application.Models.Courses.Commands.CreateCourse;
using Learning.Application.Models.Videos.Commands.CreateVideo;
using Learning.Application.Models.Videos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Videos;

public record CreateVideoResponse(Guid Id);
public class CreateVideoEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/videos", async (HttpRequest request, ISender sender) => {
            if (!request.HasFormContentType || request.Form.Files.Count == 0) {
                return Results.BadRequest("No file uploaded.");
            }
            var file = request.Form.Files[0];
            var durationString = request.Form["duration"].ToString();
            if (!double.TryParse(durationString, out var duration)) {
                return Results.BadRequest("Invalid duration.");
            }
            var command = new CreateVideoCommand(file, duration);

            var result = await sender.Send(command);

            var response = result.Adapt<CreateVideoResponse>();

            return Results.Created($"/videos/{response.Id}", response);
        })
        .WithName("CreateVideo")
        .Produces<CreateCourseResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create video")
        .WithMetadata(new IgnoreAntiforgeryTokenAttribute());
    }
}

