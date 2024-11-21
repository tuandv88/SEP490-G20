using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetFullQuizDetails;

namespace Learning.API.Endpoints.Quizs;
public record GetFullQuizDetailsResponse(QuizFullDto Quiz);
public class GetFullQuizDetailsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/{QuizId}/full-details", async (Guid QuizId, ISender sender) => {

            var result = await sender.Send(new GetFullQuizDetailsQuery(QuizId));

            var response = result.Adapt<GetFullQuizDetailsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetFullQuizDetails")
        .Produces<GetFullQuizDetailsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get full Quiz details");
    }
}
