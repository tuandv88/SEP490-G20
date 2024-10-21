using Learning.Application.Models.Files.Queries.GetFileById;

namespace Learning.API.Endpoints.Files;

public record GetFileByIdResponse(string presignedUrl);
public class GetFileByIdEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/lectures/{LectureId}/files/{FileId}", async (Guid LectureId, Guid FileId, ISender sender) => {

            var result = await sender.Send(new GetFileByIdQuery(LectureId, FileId));

            var response = result.Adapt<GetFileByIdResponse>();

            return Results.Ok(result);

        })
        .WithName("GetFileById")
        .Produces<GetFileByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get file by Id");
    }
}

