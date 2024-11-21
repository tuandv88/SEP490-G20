using Learning.Application.Models.Quizs.Commands.SubmissionQuiz;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;
public record SubmissionQuizResponse(string Status);

public class SubmissionQuizEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/quizs/submission/{SubmissionId}", async ([FromRoute] Guid SubmissionId, ISender sender) => {
            var command = new SubmissionQuizCommand(SubmissionId);

            var result = await sender.Send(command);

            var response = result.Adapt<SubmissionQuizResponse>();

            return Results.Ok(response);
        })
        .WithName("SubmissionQuiz")
        .Produces<SubmissionQuizResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Submission quiz");
    }
}