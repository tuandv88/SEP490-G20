using BuildingBlocks.CQRS;
using System;

namespace User.Application.Models.PathSteps.Queries.DeletePathStep
{
    // Định nghĩa truy vấn để xóa PathStep dựa trên PathStepId
    public record DeletePathStepQuery(Guid PathStepId) : IQuery<bool>;
}
