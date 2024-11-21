using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories; // Repository Interface
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;

namespace User.Application.Models.LearningPaths.Commands.DeleteLearningPath
{
    public class DeleteLearningPathQueryHandler : IQueryHandler<DeleteLearningPathQuery, bool>
    {
        private readonly ILearningPathRepository _learningPathRepository;
        private readonly IPathStepsRepository _pathStepRepository;

        // Constructor để inject repository
        public DeleteLearningPathQueryHandler(ILearningPathRepository learningPathRepository, IPathStepsRepository pathStepRepository)
        {
            _learningPathRepository = learningPathRepository;
            _pathStepRepository = pathStepRepository;
        }

        // Phương thức xử lý xóa LearningPath và các PathStep liên quan
        public async Task<bool> Handle(DeleteLearningPathQuery request, CancellationToken cancellationToken)
        {
            // Lấy LearningPath cần xóa từ repository
            var learningPath = await _learningPathRepository.GetByLearningPathIdAsync(request.LearningPathId);

            // Nếu không tìm thấy LearningPath, ném ngoại lệ
            if (learningPath == null)
            {
                throw new NotFoundException("LearningPath", request.LearningPathId);
            }

            // Lấy các PathStep có LearningPathId tương ứng
            var pathSteps = await _pathStepRepository.GetByLearningPathIDAsync(request.LearningPathId);

            if (pathSteps != null && pathSteps.Any())
            {
                // Xóa tất cả các PathStep liên quan
                foreach (var pathStep in pathSteps)
                {
                    await _pathStepRepository.DeleteAsync(pathStep);
                }
            }
            // Xóa LearningPath
            await _learningPathRepository.DeleteAsync(learningPath);

            // Lưu thay đổi sau khi xóa
            await _learningPathRepository.SaveChangesAsync(cancellationToken);
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            // Trả về true nếu việc xóa thành công
            return true;
        }
    }
}
