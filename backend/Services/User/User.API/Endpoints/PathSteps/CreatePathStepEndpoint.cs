using User.Application.Models.PathSteps.Commands.CreatePathStep;
using MediatR;
using User.Application.Models.PathSteps.Dtos;

namespace User.API.Endpoints.PathSteps
{
    public class CreatePathStepEndpoint : ICarterModule
    { // DTO cho yêu cầu tạo một PathStep mới
        public record CreatePathStepRequest(PathStepDto PathStepDto);

        // DTO cho phản hồi khi tạo PathStep thành công
        public record CreatePathStepResponse(Guid Id);
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/user-service/user/{userId}/pathsteps", async (Guid userId, CreatePathStepRequest request, ISender sender) =>
            {
                // Tạo command từ yêu cầu nhận vào
                var command = new CreatePathStepCommand
                {
                    UserId = userId,
                    PathStepDto = request.PathStepDto // Sử dụng đúng kiểu DTO
                };

                // Gửi command qua MediatR để xử lý
                var result = await sender.Send(command);

                // Tạo phản hồi từ kết quả trả về
                var response = new CreatePathStepResponse(result.Id);

                // Trả về HTTP 201 với đường dẫn của PathStep vừa tạo
                return Results.Created($"/user-service/user/{userId}/pathsteps/{response.Id}", response);
            })
            .WithName("CreatePathStep") // Đặt tên cho endpoint
            .Produces<CreatePathStepResponse>(StatusCodes.Status201Created) // Trả về khi tạo thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
            .WithSummary("Create a new PathStep for a user"); // Mô tả cho endpoint
        }
    }
}
