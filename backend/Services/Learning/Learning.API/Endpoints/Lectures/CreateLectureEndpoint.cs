using Learning.API.Endpoints.Chapters;
using Learning.Application.Models.Lectures.Commands.CreateLecture;
using Learning.Application.Models.Lectures.Dtos;

namespace Learning.API.Endpoints.Lectures;

public record CreateLectureRequest(CreateLectureDto CreateLectureDto);
public record CreateLectureResponse(Guid Id);
public class CreateLectureEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {

        app.MapPost("/chapters/{ChapterId}/lectures", async (Guid ChapterId, CreateLectureRequest request, ISender sender) =>
        {
            var command = new CreateLectureCommand() { ChapterId = ChapterId, CreateLectureDto = request.CreateLectureDto };

            var result = await sender.Send(command);

            var response = result.Adapt<CreateChapterResponse>();

            return Results.Created($"/courses/{ChapterId}/chapters/{response.Id}", response);
        })
        .WithName("CreateLecture")
        .Produces<CreateLectureResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create lecture");
    }
}

