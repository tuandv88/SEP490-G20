using Learning.Application.Models.Files.Commands.CreateFile;
using Learning.Application.Models.Files.Dtos;

namespace Learning.API.Endpoints.Files;
public record CreateFileResponse(Guid Id);
public class CreateFileEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/lectures/{LectureId}/files", async (HttpRequest request, Guid LectureId, ISender sender) => {

            var form = await request.ReadFormAsync();
            var file = form.Files.FirstOrDefault(); 

            if (file == null) {
                return Results.BadRequest("File is required.");
            }
            var fileType = form["fileType"].ToString();
            var duration = form["duration"].ToString();

            var createFileDto = new CreateFileDto(file, duration, fileType);
            var command = new CreateFileCommand(LectureId, createFileDto);

            var result = await sender.Send(command);
            var response = result.Adapt<CreateFileResponse>();

            return Results.Created($"/lectures/{LectureId}/files{response.Id}", response);
        })
        .WithName("CreateFile")
        .Produces<CreateFileResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create file");
    }
}

