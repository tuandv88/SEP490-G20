using Community.Application.Models.Votes.Commands.CreateVote;
using Community.Application.Models.Votes.Dtos;

namespace Community.API.Endpoints.Votes;

public class CreateVoteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/votes/create", async (CreateVoteDto createVoteDto, ISender sender) =>
        {
            var command = new CreateVoteCommand(createVoteDto);

            var result = await sender.Send(command);

            // Tạo đối tượng CreateVoteResult với các dữ liệu trả về
            var createVoteResult = new CreateVoteResult(
                Id: result.IsSuccess ? Guid.NewGuid() : (Guid?)null, // Nếu tạo thành công, tạo ID mới
                IsSuccess: result.IsSuccess,
                message: result.IsSuccess ? "Create Vote successfully" : "Create Vote Failed"
            );

            // Trả về kết quả
            if (result.IsSuccess)
            {
                return Results.Ok(createVoteResult); // Trả về kết quả thành công
            }
            else
            {
                return Results.BadRequest(createVoteResult); // Trả về kết quả thất bại
            }
        })
        .WithName("CreateVote")
        .Produces<CreateVoteResult>(StatusCodes.Status201Created)  // Chỉ định kiểu trả về cho status 201
        .Produces<CreateVoteResult>(StatusCodes.Status400BadRequest)  // Chỉ định kiểu trả về cho status 400
        .WithSummary("Create a new vote.");
    }

}
