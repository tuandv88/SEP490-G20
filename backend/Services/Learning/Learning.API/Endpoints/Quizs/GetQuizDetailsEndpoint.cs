using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizDetails;

namespace Learning.API.Endpoints.Quizs;

public record GetQuizDetailsResponse(QuizDto QuizDto, AnswerDto Answer);
public class GetQuizDetailsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/{QuizId}", async (Guid QuizId, ISender sender) => {

            var result = await sender.Send(new GetQuizDetailQuery(QuizId));

            var response = result.Adapt<GetQuizDetailsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetQuizDetails")
        .Produces<GetQuizDetailsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Quiz details");
    }
}
