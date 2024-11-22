using Learning.Application.Models.Submissions.Dtos;
using Learning.Application.Models.Submissions.Queries.GetUserSubmissionByProblem;

namespace Learning.API.Endpoints.Submissions;

public record GetSubmissionLectureViewResponse(List<SubmissionLectureViewDto> Submissions);
public record GetSubmissionLectureViewEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems/{ProblemId}/submissions", async (Guid ProblemId, ISender sender) => {

            var result = await sender.Send(new GetUserSubmissionByProblemQuery(ProblemId));

            var response = result.Adapt<GetSubmissionLectureViewResponse>();

            return Results.Ok(response);
        })
      .WithName("GetProblemSubmission")
      .Produces<GetSubmissionLectureViewResponse>(StatusCodes.Status200OK)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .ProducesProblem(StatusCodes.Status404NotFound)
      .WithSummary("Get problem submission");
    }
}

