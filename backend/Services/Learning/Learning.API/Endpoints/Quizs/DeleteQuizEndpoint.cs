using Learning.Application.Models.Quizs.Commands.DeleteQuiz;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;
public class DeleteQuizEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/quizs/{QuizId}", async ([FromRoute] Guid QuizId, ISender sender) => {
            var command = new DeleteQuizCommand(QuizId);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
        .WithName("DeleteQuiz")
        .Produces(StatusCodes.Status204NoContent)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Delete Quiz");
    }
}