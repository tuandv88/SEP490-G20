using Learning.Application.Models.Quizs.Commands.StartQuiz;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;
public record StartQuizResponse(Guid QuizSubmissionId);
public class StartQuizEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/quizs/{QuizId}/start", async ([FromRoute] Guid QuizId, ISender sender) => {
            var command = new StartQuizCommand(QuizId);

            var result = await sender.Send(command);

            var response = result.Adapt<StartQuizResponse>();

            return Results.Ok(response);
        })
        .WithName("StartQuiz")
        .Produces<StartQuizResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Start quiz");
    }
}