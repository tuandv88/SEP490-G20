using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsByUserId;
using Microsoft.AspNetCore.Mvc;

namespace Community.API.Endpoints.Discussions;

public record GetDiscussionsByUserIdResponse(PaginatedResult<DiscussionDetailUserDto> DiscussionDetailUserDtos);

public class GetDiscussionsByUserIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/byuserid", async ([AsParameters] PaginationRequest request, string? SearchKeyword,  string? Tags,
                                                    ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsByUserIdQuery(request, SearchKeyword, Tags));

            // Ánh xạ kết quả từ result sang response
            var response = result.Adapt<GetDiscussionsByUserIdResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsByUserId")
        .Produces<GetDiscussionsByUserIdResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions with Pagination by UserId");
    }
}
