﻿using Microsoft.AspNetCore.Routing;
using MediatR;
using User.Application.Models.PathSteps.Commands.UpdatePathStep;
using User.Application.Models.PathSteps.Dtos;
using Microsoft.AspNetCore.Http;

namespace User.API.Endpoints.PathSteps
{
    public class UpdatePathStepEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/pathsteps", async (UpdatePathStepsRequestDto requestDto, ISender sender) =>
            {
                // Cấu trúc Command để truyền vào handler với mảng các PathStep
                var command = new UpdatePathStepCommand(requestDto.PathSteps);

                var result = await sender.Send(command);

                return result
                    ? Results.NoContent() // Trả về 204 nếu thành công
                    : Results.BadRequest("Không thể cập nhật PathSteps.");
            })
            .WithName("UpdatePathStep")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Cập nhật PathSteps");
        }
    }
}
