using Learning.Application.Models.Quizs.Commands.ChangeQuizStatus;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;

public record ChangeQuizStausResponse(bool IsSuccess);
public class ChangeQuizStatusEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/quizs/{QuizId}/change-status", async ([FromRoute] Guid QuizId, ISender sender) => {
            var command = new ChangeQuizStatusCommand(QuizId);

            var result = await sender.Send(command);

            var response = result.Adapt<ChangeQuizStausResponse>();

            return Results.Ok(response);
        })
        .WithName("ChangeQuizStatus")
        .Produces<ChangeQuizStausResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Change Quiz Status");
    }
}
