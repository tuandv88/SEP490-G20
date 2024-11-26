using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizAssessment;
using Learning.Application.Models.Quizs.Queries.GetQuizById;

namespace Learning.API.Endpoints.Quizs;

public record GetQuizAssessmentResponse(QuizDto Quiz);
public class GetQuizAssessmentEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/assessment", async (ISender sender) => {

            var result = await sender.Send(new GetQuizAssessmentQuery());

            var response = result.Adapt<GetQuizAssessmentResponse>();

            return Results.Ok(response);
        })
        .WithName("GetQuizAssessment")
        .Produces<GetQuizAssessmentResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Quiz Assessment");
    }
}