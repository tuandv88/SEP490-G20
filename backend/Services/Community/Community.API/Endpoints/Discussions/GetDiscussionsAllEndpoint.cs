using Community.Application.Models.Discussions.Dtos;
using Community.Application.Models.Discussions.Queries.GetDiscussionsAll;

namespace Community.API.Endpoints.Discussions;

public record GetDiscussionsAllResponse(PaginatedResult<DiscussionDetailUserDto> DiscussionDetailUserDtos);

public class GetDiscussionsAllEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/discussions/all", async ([AsParameters] PaginationRequest request, string? SearchKeyword, string? Tags,
                                                    ISender sender) =>
        {
            var result = await sender.Send(new GetDiscussionsAllQuery(request, SearchKeyword, Tags));

            // Ánh xạ kết quả từ result sang response
            var response = result.Adapt<GetDiscussionsAllResponse>();

            return Results.Ok(response);
        })
        .WithName("GetDiscussionsAll")
        .Produces<GetDiscussionsAllResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .WithSummary("Get Discussions All with Pagination");
    }
}