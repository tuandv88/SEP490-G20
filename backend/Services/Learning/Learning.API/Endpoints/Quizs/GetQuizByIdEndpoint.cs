using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizById;

namespace Learning.API.Endpoints.Quizs;

public record GetQuizByIdResponse(QuizDto Quiz);
public class GetQuizByIdEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/{QuizId}", async (Guid QuizId, ISender sender) => {

            var result = await sender.Send(new GetQuizByIdQuery(QuizId));

            var response = result.Adapt<GetQuizByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetQuizById")
        .Produces<GetQuizByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Quiz basic");
    }
}