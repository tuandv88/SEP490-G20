using Community.Application.Models.UserDiscussions.Commands.CreateUserDiscussion;
using Community.Application.Models.UserDiscussions.Dtos;

namespace Community.API.Endpoints.UserDiscussions;

public class CreateUserDiscussionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/userdiscussions", async (CreateUserDiscussionDto dto, ISender sender) =>
        {
            var command = new CreateUserDiscussionCommand(dto);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Created($"Id: {result.Id}", new { Message = "User discussion created successfully", result.Id });
            }
            else
            {
                return Results.BadRequest(new { Message = "Failed to create user discussion" });
            }
        })
        .WithName("CreateUserDiscussion")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a new user discussion.");
    }
}
