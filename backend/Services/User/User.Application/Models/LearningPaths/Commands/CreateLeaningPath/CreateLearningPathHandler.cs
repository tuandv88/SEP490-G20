using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.LearningPaths.Dtos;
using User.Domain.ValueObjects;

namespace User.Application.Models.LearningPaths.Commands.CreateLeaningPath
{
    public class CreateLearningPathHandler : IRequestHandler<CreateLearningPathCommand, CreateLearningPathResult>
    {
        private readonly ILearningPathRepository _learningPathRepository;

        public CreateLearningPathHandler(ILearningPathRepository learningPathRepository)
        {
            _learningPathRepository = learningPathRepository;
        }

        public async Task<CreateLearningPathResult> Handle(CreateLearningPathCommand request, CancellationToken cancellationToken)
        {
            // Tạo mới đối tượng LearningPath
            var learningPath = CreateNewLearningPath(request.UserId, request.LearningPathDto);

            // Thêm vào cơ sở dữ liệu
            await _learningPathRepository.AddAsync(learningPath);
            await _learningPathRepository.SaveChangesAsync(cancellationToken);

            // Trả về kết quả với ID của LearningPath vừa tạo
            return new CreateLearningPathResult(learningPath.Id.Value);
        }

        private LearningPath CreateNewLearningPath(Guid userId, LearningPathDto learningPathDto)
        {
            return LearningPath.Create(
                learningPathId: LearningPathId.Of(Guid.NewGuid()),
                userId: UserId.Of(userId),
                pathName: learningPathDto.PathName,
                startDate: learningPathDto.StartDate,
                endDate: learningPathDto.EndDate,
                status: learningPathDto.Status
            );
        }
    }
}
