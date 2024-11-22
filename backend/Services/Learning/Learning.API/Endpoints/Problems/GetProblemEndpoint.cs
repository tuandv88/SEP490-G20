using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetProblems;

namespace Learning.API.Endpoints.Problems;

public record GetProblemResponse(PaginatedResult<ProblemListDto> Problems);
public class GetProblemEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems", async ([AsParameters] PaginationRequest request, [AsParameters] GetProblemsFilter filter, ISender sender) => {
            var result = await sender.Send(new GetProblemsQuery(request, filter));

            var response = result.Adapt<GetProblemResponse>();

            return Results.Ok(response);

        })
       .WithName("GetProblems")
       .Produces<GetProblemResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get Problems");
    }
}

