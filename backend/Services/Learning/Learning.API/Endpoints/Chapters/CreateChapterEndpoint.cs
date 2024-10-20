using Learning.Application.Models.Chapters.Commands.CreateChapter;

namespace Learning.API.Endpoints.Chapters;

public record CreateChapterRequest(CreateChapterDto CreateChapterDto);
public record CreateChapterResponse(Guid Id);
public class CreateChapterEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/courses/{CourseId}/chapters", async (Guid CourseId, CreateChapterRequest request, ISender sender) => {
            var command = new CreateChapterCommand() { CourseId = CourseId, CreateChapterDto = request.CreateChapterDto};

            var result = await sender.Send(command);

            var response = result.Adapt<CreateChapterResponse>();

            return Results.Created($"/courses/{CourseId}/chapters{response.Id}", response);
        })
        .WithName("CreateChapter")
        .Produces<CreateChapterResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create chapter");
    }
}

