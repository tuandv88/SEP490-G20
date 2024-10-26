using Learning.Application.Models.Lectures.Dtos;
using Learning.Application.Models.Lectures.Queries.GetLecureById;

namespace Learning.API.Endpoints.Lectures;

public record GetLectureByIdDetailResponse(LectureDetailsDto LectureDetailsDto);
public class GetLectureByIdDetailEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/chapters/{ChapterId}/lectures/{LectureId}", async (Guid ChapterId, Guid LectureId, ISender sender) => {
            var command = new GetLectureByIdDetailQuery(ChapterId, LectureId);

            var result = await sender.Send(command);

            var response = result.Adapt<GetLectureByIdDetailResponse>();

            return Results.Ok(response);
        })
      .WithName("GetLectureByIdDetail")
      .Produces<CreateLectureResponse>(StatusCodes.Status201Created)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .WithSummary("Get lecture by id detail");
    }
}

