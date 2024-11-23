using User.API.Endpoints.LearningPath;
using User.Application.Models.LearningPaths.Commands.CreateLeaningPath;
using User.Application.Models.LearningPaths.Dtos;

namespace User.API.Endpoints.LearningPath
{
    // DTO nhận vào từ client khi tạo LearningPath
    public record CreateLearningPathRequest(LearningPathDto LearningPathDto);

    // DTO trả về khi LearningPath được tạo thành công
    public record CreateLearningPathResponse(Guid Id);

    // Endpoint định nghĩa
    public class CreateLearningPathEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            // Định nghĩa endpoint POST
            app.MapPost("/user/{userId}/learning-paths", async (Guid userId,CreateLearningPathRequest request, ISender sender) =>
            {
                // Tạo command với dữ liệu từ request
                var command = new CreateLearningPathCommand
                {
                    UserId = userId,
                    LearningPathDto = request.LearningPathDto // Sử dụng LearningPathDto từ request
                };

                // Gửi command qua MediatR
                var result = await sender.Send(command);

                // Ánh xạ kết quả trả về thành CreateLearningPathResponse
                var response = new CreateLearningPathResponse(result.Id);

                // Trả về HTTP 201 với đường dẫn của LearningPath vừa tạo
                return Results.Created($"/user/{userId}/learning-paths/{response.Id}", response);
            })
            .WithName("CreateLearningPath") // Đặt tên cho endpoint
            .Produces<CreateLearningPathResponse>(StatusCodes.Status201Created) // Trả về khi tạo thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
            .WithSummary("Create a Learning Path for a user"); // Thêm mô tả cho endpoint
        }
    }
}
