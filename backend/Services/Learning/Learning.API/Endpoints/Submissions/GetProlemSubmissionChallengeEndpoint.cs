using Learning.Application.Models.Quizs.Dtos;
using Learning.Application.Models.Submissions.Queries.GetProblemChallenge;

namespace Learning.API.Endpoints.Submissions;
public record GetProlemSubmissionChallengeResponse(List<SubmissionLectureViewDto> Submissions);
public class GetProlemSubmissionChallengeEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems/{ProblemId}/submissions/challenge", async (Guid ProblemId, ISender sender) => {

            var result = await sender.Send(new GetProblemSubmissionChallengeQuery(ProblemId));

            var response = result.Adapt<GetProlemSubmissionChallengeResponse>();

            return Results.Ok(response);
        })
      .WithName("GetProblemSubmissionChallenge")
      .Produces<GetProlemSubmissionChallengeResponse>(StatusCodes.Status200OK)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .ProducesProblem(StatusCodes.Status404NotFound)
      .WithSummary("Get problem submission challenge");
    }
}

