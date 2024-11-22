using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizSubmissionDetails;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;
public record GetAnswerQuizSubmissionResponse(QuizSubmissionDto QuizSubmission);
public class GetAnswerQuizSubmissionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/submissions/{SubmissionId}/answer", async ([FromRoute] Guid SubmissionId, ISender sender) => {
            var command = new GetAnswerQuizSubmissionQuery(SubmissionId);

            var result = await sender.Send(command);

            var response = result.Adapt<GetAnswerQuizSubmissionResponse>();

            return Results.Ok(response);
        })
        .WithName("GetQuizSubmissionsAnswer")
        .Produces<GetAnswerQuizSubmissionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Get quiz submission answer");
    }
}