
using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetProblemById;
using Learning.Application.Models.Problems.Queries.GetProblemDetails;

namespace Learning.API.Endpoints.Problems;

public record GetProblemDetailsResponse(ProblemDetailsDto ProblemDetailsDto);
public class GetProblemDetailsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems/{ProblemId}/details", async (Guid ProblemId, ISender sender) => {

            var result = await sender.Send(new GetProblemDetailsQuery(ProblemId));

            var response = result.Adapt<GetProblemDetailsResponse>();

            return Results.Ok(response);
        })
        .WithName("GetProblemDetails")
        .Produces<GetProblemDetailsResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get problem details");
    }
}
