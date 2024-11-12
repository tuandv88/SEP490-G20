using BuildingBlocks.CQRS;
using System;

namespace User.Application.Models.LearningPaths.Queries.DeleteLearningPath
{
    // Định nghĩa truy vấn để xóa LearningPath và các PathStep có LearningPathId
    public record DeleteLearningPathQuery(Guid LearningPathId) : IQuery<bool>;
}
