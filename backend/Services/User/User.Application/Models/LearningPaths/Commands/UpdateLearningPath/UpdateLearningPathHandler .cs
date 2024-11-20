using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.LearningPaths.Dtos;
using BuildingBlocks.Exceptions;

namespace User.Application.Models.LearningPaths.Commands.UpdateLearningPath
{
    public class UpdateLearningPathCommandHandler : IRequestHandler<UpdateLearningPathCommand, bool>
    {
        private readonly ILearningPathRepository _learningPathRepository;

        public UpdateLearningPathCommandHandler(ILearningPathRepository learningPathRepository)
        {
            _learningPathRepository = learningPathRepository;
        }

        public async Task<bool> Handle(UpdateLearningPathCommand request, CancellationToken cancellationToken)
        {
            var dto = request.LearningPathDto;

            // Lấy LearningPath cần cập nhật
            var learningPath = await _learningPathRepository.GetByLearningPathIdAsync(dto.Id);

            if (learningPath == null)
            {
                throw new NotFoundException($"LearningPath với Id '{dto.Id}' không tồn tại.");
            }

            // Cập nhật các thuộc tính của LearningPath
            learningPath.PathName = dto.PathName;
            learningPath.StartDate = dto.StartDate;
            learningPath.EndDate = dto.EndDate;
            learningPath.Status = dto.Status;

            // Lưu thay đổi
            await _learningPathRepository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
