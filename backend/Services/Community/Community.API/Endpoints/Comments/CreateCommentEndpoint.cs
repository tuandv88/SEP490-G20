using Community.Application.Models.Comments.Commands.CreateComment;
using Community.Application.Models.Comments.Dtos;

namespace Community.API.Endpoints.Comments;

public class CreateCommentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/comments/create", async (CreateCommentDto createCommentDto, ISender sender) =>
        {
            var command = new CreateCommentCommand(createCommentDto);

            var result = await sender.Send(command);

            if (result.IsSuccess)
            {
                return Results.Ok(new { Message = "Comment created successfully", NewStatus = result.IsSuccess });
            }
            else
            {
                return Results.BadRequest(new { Message = "Comment creation failed", NewStatus = result.IsSuccess });
            }
        })
        .WithName("CreateComment")
        .Produces(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Create a new comment.");
    }
}
