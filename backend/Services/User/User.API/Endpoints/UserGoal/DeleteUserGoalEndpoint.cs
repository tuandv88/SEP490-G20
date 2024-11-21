using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using BuildingBlocks.Exceptions;
using User.Application.Models.UserGoals.Commands.DeleteUserGoal;

namespace User.API.Endpoints.UserGoal
{
    public class DeleteUserGoalEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            // Định nghĩa endpoint xóa UserGoal
            app.MapDelete("/UserGoals/{UserGoalId}", async (Guid UserGoalId, ISender sender) =>
            {
                try
                {
                    // Gửi truy vấn xóa UserGoal qua MediatR
                    var result = await sender.Send(new DeleteUserGoalQuery(UserGoalId));

                    if (result)
                    {
                        // Trả về mã 204 No Content nếu xóa thành công
                        return Results.NoContent();
                    }

                    // Nếu không tìm thấy UserGoal để xóa
                    return Results.NotFound(new { message = "UserGoal not found with given UserGoalId" });
                }
                catch (NotFoundException ex)
                {
                    // Trả về mã 404 Not Found nếu không tìm thấy UserGoal
                    return Results.NotFound(new { message = ex.Message });
                }
                catch (Exception ex)
                {
                    // Trả về mã 500 Internal Server Error nếu có lỗi ngoài ý muốn
                    return Results.Problem(detail: ex.Message);
                }
            })
            .WithName("DeleteUserGoal")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Delete UserGoal by UserGoalId");
        }
    }
}
