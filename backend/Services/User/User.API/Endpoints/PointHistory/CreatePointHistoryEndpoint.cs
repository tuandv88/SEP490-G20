using Carter;
using User.Application.Models.PointHistories.Commands.CreatePointHistory;
using User.Application.Models.Dtos; // Đảm bảo rằng bạn có namespace này

namespace User.API.Endpoints.PointHistory
{
    // Request DTO để nhận dữ liệu từ client
    public record CreatePointHistoryRequest(CreatePointHistoryDto CreatePointHistoryDto);
    public record CreatePointHistoryResponse(Guid Id);
    public class CreatePointHistoryEndpoint : ICarterModule
    {  
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            // Định nghĩa route cho HTTP POST để tạo PointHistory
            app.MapPost("/user-service/user/{userId}/pointhistory", async (Guid userId, CreatePointHistoryRequest request, ISender sender) =>
            {

                var command = new CreatePointHistoryCommand
                {
                    UserId = userId,
                    CreatePointHistoryDto = request.CreatePointHistoryDto // Sử dụng đúng kiểu DTO
                };

                // Gửi command qua MediatR
                var result = await sender.Send(command);

                // Ánh xạ kết quả trả về thành CreatePointHistoryResponse
                var response = result.Adapt<CreatePointHistoryResponse>();

                // Trả về HTTP 201 với đường dẫn của PointHistory vừa tạo
                return Results.Created($"/user-service/user/{userId}/pointhistory/{response.Id}", response);

            })
            .WithName("CreatePointHistory") // Đặt tên cho endpoint
            .Produces<CreatePointHistoryResponse>(StatusCodes.Status201Created) // Trả về khi tạo thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
            .WithSummary("Create point history for a user"); // Thêm mô tả cho endpoint
        }
    }

 
}
