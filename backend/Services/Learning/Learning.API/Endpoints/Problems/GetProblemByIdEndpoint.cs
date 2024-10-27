using Learning.Application.Models.Problems.Dtos;
using Learning.Application.Models.Problems.Queries.GetProblemById;

public record GetProblemByIdResponse(ProblemDto ProblemDto);
namespace Learning.API.Endpoints.Problems {
    public class GetProblemByIdEndpoint : ICarterModule {
        public void AddRoutes(IEndpointRouteBuilder app) {
            app.MapGet("/problems/{ProblemId}", async (Guid ProblemId, ISender sender) => {

                var result = await sender.Send(new GetProblemByIdQuery(ProblemId));

                var response = result.Adapt<GetProblemByIdResponse>();

                return Results.Ok(response);
            })
          .WithName("GetProblemById")
          .Produces<GetProblemByIdResponse>(StatusCodes.Status200OK)
          .ProducesProblem(StatusCodes.Status400BadRequest)
          .ProducesProblem(StatusCodes.Status404NotFound)
          .WithSummary("Get problem by id");
        }
    }

}
