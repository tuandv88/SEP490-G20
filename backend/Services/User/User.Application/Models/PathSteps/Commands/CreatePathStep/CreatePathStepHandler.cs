using User.Application.Data.Repositories;
using User.Application.Models.PathSteps.Dtos;
using User.Domain.ValueObjects;
using MediatR;

namespace User.Application.Models.PathSteps.Commands.CreatePathStep
{
    public class CreatePathStepHandler : IRequestHandler<CreatePathStepCommand, CreatePathStepResult>
    {
        private readonly IPathStepsRepository _pathStepRepository;

        // Constructor để inject repository
        public CreatePathStepHandler(IPathStepsRepository pathStepRepository)
        {
            _pathStepRepository = pathStepRepository;
        }

        // Xử lý command
        public async Task<CreatePathStepResult> Handle(CreatePathStepCommand request, CancellationToken cancellationToken)
        {
            // Tạo mới đối tượng PathStep
            var pathStep = CreateNewPathStep(request.UserId, request.PathStepDto);

            // Lưu vào cơ sở dữ liệu
            await _pathStepRepository.AddAsync(pathStep);
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            // Trả về kết quả với ID của PathStep vừa tạo
            return new CreatePathStepResult(pathStep.Id.Value);
        }

        // Phương thức tạo một PathStep mới
        private PathStep CreateNewPathStep(Guid userId, PathStepDto pathStepDto)
        {
            return PathStep.Create(
                learningPathId: LearningPathId.Of(pathStepDto.LearningPathId), // Sử dụng LearningPathId từ DTO
                courseId: CourseId.Of(pathStepDto.CourseId), // Sử dụng CourseId từ DTO
                stepOrder: pathStepDto.StepOrder, // Sử dụng StepOrder từ DTO
                status: pathStepDto.Status, // Sử dụng Status từ DTO
                enrollmentDate: pathStepDto.EnrollmentDate, // Sử dụng EnrollmentDate từ DTO
                expectedCompletionDate: pathStepDto.ExpectedCompletionDate // Sử dụng ExpectedCompletionDate từ DTO
            );
        }
    }
}
