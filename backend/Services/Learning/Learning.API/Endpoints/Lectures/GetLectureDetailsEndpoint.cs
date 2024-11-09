using Learning.Application.Models.Lectures.Dtos;
using Learning.Application.Models.Lectures.Queries.GetLecureById;

namespace Learning.API.Endpoints.Lectures;

public record GetLectureDetailsResponse(LectureDetailsDto LectureDetailsDto);
public class GetLectureDetailsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/lectures/{LectureId}/details", async (Guid LectureId, ISender sender) => {
            var command = new GetLectureDetailQuery(LectureId);

            var result = await sender.Send(command);

            var response = result.Adapt<GetLectureDetailsResponse>();

            return Results.Ok(response);
        })
      .WithName("GetLectureDetail")
      .Produces<GetLectureDetailsResponse>(StatusCodes.Status201Created)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .WithSummary("Get lecture detail");
    }
}

