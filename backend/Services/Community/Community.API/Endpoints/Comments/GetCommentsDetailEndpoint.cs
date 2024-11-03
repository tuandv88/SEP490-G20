using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentsDetail;

namespace Community.API.Endpoints.Comments;
public record GetCommentsDetailResponse(List<CommentDetailDto> CommentDetailDtos);

public class GetCommentsDetailEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/comments/detail", async (ISender sender) =>
        {
            var result = await sender.Send(new GetCommentsDetailQuery());

            var response = result.Adapt<GetCommentsDetailResponse>();

            return Results.Ok(response);
        })
        .WithName("GetCommentsDetail")
        .Produces<GetCommentsDetailResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get all Comments Detail");
    }
}
