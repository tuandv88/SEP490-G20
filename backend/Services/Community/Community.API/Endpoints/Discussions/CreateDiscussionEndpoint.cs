using Community.Application.Models.Discussions.Commands.CreateDiscussion;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;

public class CreateDiscussionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/discussions/create", async (CreateDiscussionDto createDiscussionDto, ISender sender) =>
        {
            var command = new CreateDiscussionCommand(createDiscussionDto);
            var result = await sender.Send(command);

            return Results.Created($"Id Discussion: {result.Id}", new { result.Id });
        })
        .WithName("CreateDiscussion")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a new discussion.");
    }
}
