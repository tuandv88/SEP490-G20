using User.Application.Models.LearningPaths.Dtos;
using User.Application.Models.LearningPaths.Queries;
using User.Application.Models.LearningPaths.Queries.GetLearningPathByUserId;

namespace User.API.Endpoints.LearningPath;

public record GetlearningPathByUserIdReponse (LearningPathDto LearningPathDto);

    public class GetLearningPathByUserIdEndpoint :ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/users/learning-path", async (ISender sender) => {
            var result = await sender.Send(new GetLearningPathByUserIdQuery());

            var response = result.Adapt<GetlearningPathByUserIdReponse>();

            return Results.Ok(result);

        })
        .WithName("GetLearningPathByUserId")
        .Produces<GetlearningPathByUserIdReponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get LearningPath by UserId");
    }
}

