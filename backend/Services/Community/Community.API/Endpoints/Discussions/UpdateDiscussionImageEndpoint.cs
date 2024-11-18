using Community.Application.Models.Discussions.Commands.UpdateImageDiscussion;
using Community.Application.Models.Discussions.Dtos;

namespace Community.API.Endpoints.Discussions;

public record UpdateDiscussionImageRequest(Guid Id, ImageDto ImageDto);
public record UpdateDiscussionImageRepsonse(string PresignedUrl);
public class UpdateDiscussionImageEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/discussions/updateimage", async (UpdateDiscussionImageRequest request, ISender sender) => {
            var command = request.Adapt<UpdateDiscussionImageCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateDiscussionImageRepsonse>();

            return Results.Ok(response);
        })
        .WithName("UpdateDiscussionImage")
        .Produces<UpdateDiscussionImageRepsonse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Discussion image");
    }
}
