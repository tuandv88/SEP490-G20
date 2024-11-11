using Community.Application.Models.Comments.Dtos;
using Community.Application.Models.Comments.Queries.GetCommentDetailById;

namespace Community.API.Endpoints.Comments
{
    public record GetCommentDetailByIdResponse(CommentDetailDto CommentDetailDto);
    public class GetCommentDetailByIdEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/comment/{id:guid}/details", async (Guid id, ISender sender) =>
            {
                var result = await sender.Send(new GetCommentDetailByIdQuery(id));

                var response = result.Adapt<GetCommentDetailByIdResponse>();

                return Results.Ok(response);
            })
            .WithName("GetCommentDetailById")
            .Produces<GetCommentDetailByIdResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Comment Detail By Id");
        }
    }

}
