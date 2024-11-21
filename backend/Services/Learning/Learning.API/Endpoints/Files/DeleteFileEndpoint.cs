using Learning.Application.Models.Files.Commands.DeleteFile;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Files;
public class DeleteFileEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapDelete("/lectures/{LectureId}/files/{FileId}", async ([FromRoute] Guid LectureId, [FromRoute] Guid FileId, ISender sender) => {

            var command = new DeleteFileCommand(LectureId, FileId);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
        .WithName("DeleteFile")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Delete file");
    }
}
