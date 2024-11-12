using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;  // Repository Interface
using User.Application.Models.PathSteps.Dtos; // PathStepDto
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions; // CQRS Interfaces

namespace User.Application.Models.PathSteps.Queries.GetLeaningPathById
{
    public class GetPathStepsByLearningPathIdHandler : IQueryHandler<GetPathStepsByLearningPathIdQuery, GetPathStepsByLearningPathIdQueryResult>
    {
        private readonly IPathStepsRepository _pathStepsRepository;

        // Constructor để Inject repository vào handler
        public GetPathStepsByLearningPathIdHandler(IPathStepsRepository pathStepsRepository)
        {
            _pathStepsRepository = pathStepsRepository;
        }

        // Phương thức Handle sẽ xử lý truy vấn GetPathStepsByLearningPathIdQuery
        public async Task<GetPathStepsByLearningPathIdQueryResult> Handle(GetPathStepsByLearningPathIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy tất cả PathSteps từ repository bằng LearningPathId
            var pathSteps = await _pathStepsRepository.GetByLearningPathIDAsync(request.LearningPathId);

            if (pathSteps == null || pathSteps.Count == 0)
            {
                // Nếu không tìm thấy bất kỳ PathStep nào, ném exception hoặc trả về kết quả không tìm thấy
                throw new NotFoundException("PathSteps", request.LearningPathId);
            }

            // Chuyển danh sách PathSteps thành danh sách PathStepDto (nếu cần chuyển đổi)
            var pathStepDtos = new List<PathStepDto>();
            foreach (var pathStep in pathSteps)
            {
                // Cập nhật đầy đủ các tham số trong PathStepDto
                pathStepDtos.Add(new PathStepDto(
                    pathStep.Id.Value,
                    pathStep.LearningPathId.Value,
                    pathStep.CourseId.Value,  // Đảm bảo CourseId được cung cấp
                    pathStep.StepOrder,        // Đảm bảo StepOrder được cung cấp
                    pathStep.Status,           // Truyền trạng thái đúng kiểu
                    pathStep.EnrollmentDate,   // Đảm bảo EnrollmentDate không null
                    pathStep.CompletionDate,  // CompletionDate có thể null
                    pathStep.ExpectedCompletionDate  // ExpectedCompletionDate có thể null
                ));
            }

            // Trả về kết quả Query với danh sách PathStepDto
            return new GetPathStepsByLearningPathIdQueryResult(pathStepDtos);
        }
    }
}
