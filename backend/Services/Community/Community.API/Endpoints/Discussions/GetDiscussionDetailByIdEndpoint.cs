using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionDetailById;

namespace Community.API.Endpoints.Discussions;

public record GetDiscussionDetailByIdResponse(DiscussionDetailsDto DiscussionDetailsDto);

public class GetDiscussionDetailByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/{id:guid}/details", async (Guid id, ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionDetailByIdQuery(id));

            // Ánh xạ kết quả thành `GetCategoryDetailByIdResponse`
            var response = result.Adapt<GetDiscussionDetailByIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionDetailById")
        .Produces<GetDiscussionDetailByIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussion Details by Id.");
    }
}
