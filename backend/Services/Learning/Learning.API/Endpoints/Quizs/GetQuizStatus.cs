using Learning.Application.Models.Quizs.Commands.StartQuiz;
using Learning.Application.Models.Quizs.Queries.GetQuizStatus;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;
public record GetQuizStatusResponse(string Status);
public class GetQuizStatus : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/quizs/{QuizId}/status", async ([FromRoute] Guid QuizId, ISender sender) =>
            {
                var query = new GetQuizStatusQuery(QuizId);

                var result = await sender.Send(query);

                var response = result.Adapt<GetQuizStatusResponse>();

                return Results.Ok(response);
            })
            .WithName("GetQuizStatus")
            .Produces<GetQuizStatusResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get quiz status");
    }
}