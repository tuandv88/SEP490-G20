using Learning.Application.Models.Questions.Commands.UpdateQuestion;
using Learning.Application.Models.Questions.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Questions;

public record UpdateQuestionRequest(UpdateQuestionDto Question);
public record UpdateQuestionResponse(bool IsSucess);

public class UpdateQuestionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/quizs/{QuizId}/questions/{QuestionId}", async ([FromRoute] Guid QuizId, [FromRoute] Guid QuestionId, UpdateQuestionRequest request, ISender sender) => {
            var command = new UpdateQuestionCommand(QuizId, QuestionId, request.Question);

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateQuestionResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateQuestion")
        .Produces<UpdateQuestionResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Question");
    }
}

