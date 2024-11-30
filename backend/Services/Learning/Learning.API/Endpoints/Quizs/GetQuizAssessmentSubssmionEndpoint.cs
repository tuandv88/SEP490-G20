using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Quizs.Queries.GetQuizAssessment;
using Learning.Application.Models.Quizs.Queries.GetQuizAssessmentSubmission;

namespace Learning.API.Endpoints.Quizs;
public record GetQuizAssessmentSubmissionResponse(List<QuizSubmissionAssessmentDto> Quízs);
public class GetQuizAssessmentSubssmionEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapGet("/quizs/assessment/submission", async (ISender sender) => {

            var result = await sender.Send(new GetQuizAssessmentSubmissionQuery());

            var response = result.Adapt<GetQuizAssessmentSubmissionResponse>();

            return Results.Ok(response);
        })
        .WithName("GetQuizAssessmentSubmission")
        .Produces<GetQuizAssessmentSubmissionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Quiz Assessment Submission");
    }
}