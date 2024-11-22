using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizSubmission;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Quizs;

public record GetQuizSubmissionResponse(List<QuizSubmissionDto> QuizSubmissions);
public class GetQuizSubmissionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/{QuizId}/submissions", async ([FromRoute] Guid QuizId, ISender sender) => {
            var command = new GetQuizSubmissionQuery(QuizId);

            var result = await sender.Send(command);

            var response = result.Adapt<GetQuizSubmissionResponse>();

            return Results.Ok(response);
        }) 
        .WithName("GetQuizSubmissions")
        .Produces<SubmissionQuizResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Get quiz submission");
    }
}