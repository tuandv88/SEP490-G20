using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetSolvedProblems;

namespace Learning.API.Endpoints.Problems;

public record GetSolvedProblemResponse(SolvedProblemsDto Solved);
public class GetSolvedProblemEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/problems/solved-by-difficulty", async (ISender sender) => {
            var result = await sender.Send(new GetSolvedProblemsQuery());

            var response = result.Adapt<GetSolvedProblemResponse>();

            return Results.Ok(response);

        })
       .WithName("GetProblemsSolved")
       .Produces<GetSolvedProblemResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get Problems Solved");
    }
}

