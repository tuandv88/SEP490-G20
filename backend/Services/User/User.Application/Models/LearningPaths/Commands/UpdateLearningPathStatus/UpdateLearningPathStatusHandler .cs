using MediatR;
using User.Application.Data.Repositories;
using BuildingBlocks.Exceptions;
using User.Application.Models.LearningPaths.Commands.UpdateLearningPathStatus;

namespace User.Application.Models.LearningPaths.Commands.UpdateLearningPathStatus
{
    public class UpdateLearningPathStatusHandler : IRequestHandler<UpdateLearningPathStatusCommand, bool>
    {
        private readonly ILearningPathRepository _learningPathRepository;

        public UpdateLearningPathStatusHandler(ILearningPathRepository learningPathRepository)
        {
            _learningPathRepository = learningPathRepository;
        }

        public async Task<bool> Handle(UpdateLearningPathStatusCommand request, CancellationToken cancellationToken)
        {
            var learningPath = await _learningPathRepository.GetByLearningPathIdAsync(request.Id);

            if (learningPath == null)
            {
                throw new NotFoundException($"LearningPath với Id '{request.Id}' không tồn tại.");
            }

            // Cập nhật trạng thái
            learningPath.Status = request.Status;

            // Lưu thay đổi
            await _learningPathRepository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
