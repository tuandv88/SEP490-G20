using Community.Application.Models.Flags.Commands.UpdateFlags;
using Community.Application.Models.Flags.Dtos;

namespace Community.API.Endpoints.Flags;

public record UpdateFlagRequest(UpdateFlagDto UpdateFlagDto);
public class UpdateFlagEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/flags/update", async (UpdateFlagRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateFlagCommand>();

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Flag updated successfully", NewStatus = result.IsSuccess });
            }
            else
            {
                return Results.BadRequest(new { Message = "Failed to update Flag", NewStatus = result.IsSuccess });
            }
        })
        .WithName("UpdateFlag")
        .Produces(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a Flag by its ID.");
    }
}

