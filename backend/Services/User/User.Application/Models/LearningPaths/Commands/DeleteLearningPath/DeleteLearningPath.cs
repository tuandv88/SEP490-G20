using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using System;

namespace User.Application.Models.LearningPaths.Commands.DeleteLearningPath
{
    [Authorize]
    // Định nghĩa truy vấn để xóa LearningPath và các PathStep có LearningPathId
    public record DeleteLearningPathQuery(Guid LearningPathId) : IQuery<bool>;
}
