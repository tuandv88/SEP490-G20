using Learning.Application.Models.Quizs.Commands.SubmitAnswer;
using Learning.Application.Models.Quizs.Dtos.SubmissionDto;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;

public record SubmissionAnswerRequest(QuestionAnswerDto Question);
public record SubmissionAnswerResponse(bool IsSuccess);
public class SubmissionAnswerEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/quizs/submission/{SubmissionId}/answer", async ([FromRoute] Guid SubmissionId, SubmissionAnswerRequest request, ISender sender) => {
            var command = new SubmitAnswerCommand(SubmissionId, request.Question);

            var result = await sender.Send(command);

            var response = result.Adapt<SubmissionAnswerResponse>();

            return Results.Ok(response);
        })
        .WithName("CreateSubmissionAnswer")
        .Produces<SubmissionAnswerResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create submission answer");
    }
}
