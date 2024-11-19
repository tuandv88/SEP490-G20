using Learning.Application.Models.Problems.Commands.ChangeProblemStatus;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Problems;
public record ChangeProbleStausReponse(bool IsSuccess);
public class ChangeProblemStatusEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPut("/problems/{ProblemId}/change-active", async ([FromRoute] Guid ProblemId, ISender sender) => {
            var result = await sender.Send(new ChangeProblemStatusCommand(ProblemId));

            var response = result.Adapt<ChangeProbleStausReponse>();

            return Results.Ok(response);
        })
        .WithName("ChangeProblemStatus")
        .Produces<ChangeProbleStausReponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Change prolem status");
    }
}
