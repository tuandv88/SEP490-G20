using User.Application.Data.Repositories;
using User.Application.Models.PathSteps.Dtos;
using User.Domain.ValueObjects;
using MediatR;
using User.Application.Interfaces;

namespace User.Application.Models.PathSteps.Commands.CreatePathStep
{
    public class CreatePathStepHandler : IRequestHandler<CreatePathStepCommand, CreatePathStepResult>
    {
        private readonly IPathStepsRepository _pathStepRepository;
        private readonly IUserContextService _userContext;
        // Constructor để inject repository
        public CreatePathStepHandler(IPathStepsRepository pathStepRepository, IUserContextService userContext)
        {
            _userContext = userContext;
            _pathStepRepository = pathStepRepository;
        }

        // Xử lý command
        public async Task<CreatePathStepResult> Handle(CreatePathStepCommand request, CancellationToken cancellationToken)
        {
            // Tạo mới đối tượng PathStep
            var pathStep = CreateNewPathStep( request.CreatePathStepDto);

            // Lưu vào cơ sở dữ liệu
            await _pathStepRepository.AddAsync(pathStep);
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            // Trả về kết quả với ID của PathStep vừa tạo
            return new CreatePathStepResult(pathStep.Id.Value);
        }

        // Phương thức tạo một PathStep mới
        private PathStep CreateNewPathStep(CreatePathStepDto CreatePathStepDto)
        {
            return PathStep.Create(
                learningPathId: LearningPathId.Of(CreatePathStepDto.LearningPathId), // Sử dụng LearningPathId từ DTO
                courseId: CourseId.Of(CreatePathStepDto.CourseId), // Sử dụng CourseId từ DTO
                stepOrder: CreatePathStepDto.StepOrder, // Sử dụng StepOrder từ DTO
                status: CreatePathStepDto.Status, // Sử dụng Status từ DTO
                enrollmentDate: CreatePathStepDto.EnrollmentDate, // Sử dụng EnrollmentDate từ DTO
                expectedCompletionDate: CreatePathStepDto.ExpectedCompletionDate // Sử dụng ExpectedCompletionDate từ DTO
            );
        }
    }
}
