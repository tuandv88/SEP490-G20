using Community.Application.Models.Flags.Dtos;
using Community.Application.Models.Flags.Commands.CreateFlags;

namespace Community.API.Endpoints.Flags;

public record CreateFlagRequest(CreateFlagDto CreateFlagDto);
public class CreateFlagEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/flags/create", async (CreateFlagRequest request, ISender sender) =>
        {
            var command = request.Adapt<CreateFlagCommand>();

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Flag created successfully", NewStatus = result.IsSuccess });
            }
            else
            {
                return Results.BadRequest(new { Message = "Failed to created Flag", NewStatus = result.IsSuccess });
            }
        })
        .WithName("CreateFlag")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a Flag.");
    }
}
