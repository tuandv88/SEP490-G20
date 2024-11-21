using Learning.Application.Models.Quizs.Commands.UpdateQuiz;
using Learning.Application.Models.Quizs.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;

public record UpdateQuizRequest(UpdateQuizDto Quiz);
public record UpdateQuizResponse(bool IsSuccess);
public class UpdateQuizEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/quizs/{QuizId}", async ([FromRoute]Guid QuizId, UpdateQuizRequest request, ISender sender) => {
            var command = new UpdateQuizCommand(QuizId, request.Quiz);

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateQuizResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateQuiz")
        .Produces<UpdateQuizResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Update Quiz");
    }
}

