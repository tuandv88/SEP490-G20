using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using System;

namespace User.Application.Models.PathSteps.Commands.DeletePathStep
{
    [Authorize]
    // Định nghĩa truy vấn để xóa PathStep dựa trên PathStepId
    public record DeletePathStepQuery(Guid PathStepId) : IQuery<bool>;
}
