using User.Application.Data.Repositories;
using User.Application.Models.PathSteps.Dtos;
using User.Domain.ValueObjects;
using MediatR;
using User.Application.Interfaces;
using User.Domain.Enums;

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
            // Kiểm tra xem có PathStep nào đã tồn tại với LearningPathId và CourseId giống nhau không
            var existingPathStep = await _pathStepRepository.GetByLearningPathAndCourseIdAsync(
                request.CreatePathStepDto.LearningPathId,
                request.CreatePathStepDto.CourseId);

            if (existingPathStep != null)
            {
                // Nếu tồn tại, không tiếp tục và trả về lỗi (hoặc có thể xử lý theo cách khác)
                throw new InvalidOperationException($"PathStep với CourseId '{request.CreatePathStepDto.CourseId}' đã tồn tại trong LearningPathId '{request.CreatePathStepDto.LearningPathId}'.");
            }

            // Lấy giá trị max stepOrder hiện tại từ cơ sở dữ liệu
            var maxStepOrder = await _pathStepRepository.GetMaxStepOrderByLearningPathIdAsync(request.CreatePathStepDto.LearningPathId);

            // Tạo mới đối tượng PathStep với stepOrder là maxStepOrder + 1
            int stepOrder = maxStepOrder.HasValue ? maxStepOrder.Value + 1 : 1;
            var pathStep = CreateNewPathStep(request.CreatePathStepDto, stepOrder);

            // Lưu vào cơ sở dữ liệu
            await _pathStepRepository.AddAsync(pathStep);
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            // Trả về kết quả với ID của PathStep vừa tạo
            return new CreatePathStepResult(pathStep.Id.Value);
        }

        private PathStep CreateNewPathStep(CreatePathStepDto CreatePathStepDto, int stepOrder)
        {
            return PathStep.Create(
                learningPathId: LearningPathId.Of(CreatePathStepDto.LearningPathId), // Sử dụng LearningPathId từ DTO
                courseId: CourseId.Of(CreatePathStepDto.CourseId), // Sử dụng CourseId từ DTO
                stepOrder: stepOrder, // Sử dụng stepOrder đã tính toán
                status: PathStepStatus.InProgress, // Sử dụng trạng thái InProgress
                enrollmentDate: DateTime.UtcNow, // Sử dụng EnrollmentDate từ DTO
                expectedCompletionDate: DateTime.UtcNow // Sử dụng ExpectedCompletionDate từ DTO
            );
        }
    }
}
