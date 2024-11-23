using User.Application.Models.LearningPaths.Dtos;
using User.Application.Models.LearningPaths.Queries.GetLearningPathByUserId;
using User.Application.Models.PathSteps.Dtos;
using User.Application.Models.PathSteps.Queries.GetLeaningPathById;
using User.Domain.ValueObjects;

namespace User.API.Endpoints.PathSteps
{
    public record GetPathStepsByUserIdReponse( PathStepDto PathStepsDto);
    public class GetPathStepsByIdEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/LeaningPathID/{LeaningPathID}/PathSteps", async (Guid LeaningPathID, ISender sender) => {
                var result = await sender.Send(new GetPathStepsByLearningPathIdQuery(LeaningPathID));

                var response = result.Adapt<GetPathStepsByUserIdReponse>();

                return Results.Ok(result);

            })
            .WithName("GePathStepByLeaningPathID")
            .Produces<GetPathStepsByUserIdReponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get LearningPath by UserId");
        }
    }
}
