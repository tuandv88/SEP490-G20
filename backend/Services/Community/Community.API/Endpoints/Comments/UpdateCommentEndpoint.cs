using Community.Application.Models.Comments.Commands.UpdateComment;
using Community.Application.Models.Comments.Dtos;

namespace Community.API.Endpoints.Comments;

public record UpdateCommentRequest(UpdateCommentDto UpdateCommentDto);
public record UpdateCommentResponse(bool IsSuccess);

public class UpdateCommentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/comments", async (UpdateCommentRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateCommentCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateCommentResponse>();

            return Results.Ok(response);
        })
        .WithName("UpdateComment")
        .Produces<UpdateCommentResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update a comment by its ID.");
    }
}
