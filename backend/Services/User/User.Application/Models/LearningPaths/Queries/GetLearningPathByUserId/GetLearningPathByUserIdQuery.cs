using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using User.Application.Models.LearningPaths.Dtos;

namespace User.Application.Models.LearningPaths.Queries.GetLearningPathByUserId {
    [Authorize]
    // Truy vấn để lấy danh sách LearningPaths dựa trên UserId
    public record GetLearningPathByUserIdQuery : IQuery<GetLearningPathByUserIdResult>;

    // Kết quả trả về bao gồm danh sách LearningPathDto với các PathStepDto cho mỗi LearningPath
    public record GetLearningPathByUserIdResult(List<LearningPathWithPathStepsDto> LearningPathDtos);
}
