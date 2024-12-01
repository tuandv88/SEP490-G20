using MediatR;
using User.Application.Models.PathSteps.Dtos;
using User.Application.Models.PathSteps.Commands.DeletePathStep;

namespace User.API.Endpoints.PathSteps
{
    public class DeletePathStepEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/pathsteps/{pathStepId}", async ( Guid pathStepId, ISender sender) =>
            {
                // Tạo query từ yêu cầu xóa PathStep
                var query = new DeletePathStepQuery(pathStepId);

                // Gửi query qua MediatR để xử lý
                var result = await sender.Send(query);

                if (result)
                {
                    // Trả về HTTP 204 No Content nếu xóa thành công
                    return Results.NoContent();
                }

                // Nếu không xóa thành công, trả về lỗi 404 Not Found
                return Results.NotFound($"PathStep with ID {pathStepId} not found.");
            })
            .WithName("DeletePathStep") // Đặt tên cho endpoint
            .Produces(StatusCodes.Status204NoContent) // Trả về khi xóa thành công
            .ProducesProblem(StatusCodes.Status400BadRequest) // Trả về lỗi nếu request không hợp lệ
            .WithSummary("Delete a PathStep by its ID"); // Mô tả cho endpoint
        }
    }
}
