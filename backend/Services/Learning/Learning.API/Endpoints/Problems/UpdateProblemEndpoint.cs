using Learning.Application.Models.Problems.Commands.UpdateProblem;
using Learning.Application.Models.Problems.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Problems;
public record UpdateProblemRequest(UpdateProblemDto Problem);
public record UpdateProblemResponse(bool IsSuccess);
public class UpdateProblemEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/problems/{ProblemId}", async ([FromRoute] Guid ProblemId, UpdateProblemRequest request, ISender sender) => {
            var result = await sender.Send(new UpdateProblemCommand(ProblemId, request.Problem));

            var response = result.Adapt<UpdateProblemResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateProblem")
        .Produces<UpdateProblemResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update problem");
    }
}


