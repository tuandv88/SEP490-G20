using BuildingBlocks.CQRS;
using System;
using System.Collections.Generic;
using User.Application.Models.LearningPaths.Dtos;
using User.Application.Models.PathSteps.Dtos;

namespace User.Application.Models.PathSteps.Queries.GetLeaningPathById
{
    // Truy vấn lấy danh sách PathSteps dựa trên LearningPathId
    public record GetPathStepsByLearningPathIdQuery(Guid LearningPathId) : IQuery<GetPathStepsByLearningPathIdQueryResult>;

    // Kết quả truy vấn trả về một danh sách các PathStepDto
    public record GetPathStepsByLearningPathIdQueryResult(List<PathStepDto> PathStepDtos);
}
