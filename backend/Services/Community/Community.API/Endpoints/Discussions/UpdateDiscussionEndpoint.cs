using Community.Application.Models.Discussions.Commands.UpdateDiscussion;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;

public record UpdateDiscussionRequest(UpdateDiscussionDto UpdateDiscussionDto);
public record UpdateDiscussionResponse(bool IsSuccess);

public class UpdateDiscussionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussions", async (UpdateDiscussionRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateDiscussionCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateDiscussionResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateDiscussion")
        .Produces<UpdateDiscussionResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update an existing discussion.");
    }
}
