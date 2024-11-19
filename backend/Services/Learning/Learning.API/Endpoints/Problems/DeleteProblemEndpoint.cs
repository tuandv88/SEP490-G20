using Learning.Application.Models.Problems.Commands.DeleteProblem;
using Microsoft.AspNetCore.Mvc;

namespace Learning.API.Endpoints.Problems;
public class DeleteProblemEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/problems/{ProblemId}", async ([FromRoute] Guid ProblemId, ISender sender) => {

            await sender.Send(new DeleteProblemCommand(ProblemId));
            
            return Results.NoContent();
        })
       .WithName("DeleteProblem")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete problem");
    }
}
