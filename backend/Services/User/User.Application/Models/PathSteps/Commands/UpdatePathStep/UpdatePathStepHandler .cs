using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.PathSteps.Dtos;
using BuildingBlocks.Exceptions;
using User.Domain.ValueObjects;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using User.Domain.Enums;
using System;

namespace User.Application.Models.PathSteps.Commands.UpdatePathStep
{
    public class UpdatePathStepCommandHandler : IRequestHandler<UpdatePathStepCommand, bool>
    {
        private readonly IPathStepsRepository _pathStepRepository;

        // Constructor để inject repository
        public UpdatePathStepCommandHandler(IPathStepsRepository pathStepRepository)
        {
            _pathStepRepository = pathStepRepository;
        }

        public async Task<bool> Handle(UpdatePathStepCommand request, CancellationToken cancellationToken)
        {
            // Lấy LearningPathID từ dữ liệu request
            var learningPathID = request.PathStepDtos.FirstOrDefault()?.LearningPathId;

            // Kiểm tra nếu learningPathID không hợp lệ
            if (!learningPathID.HasValue)
            {
                throw new ArgumentException("LearningPathID không hợp lệ.");
            }

            // Lấy danh sách PathSteps hiện có từ repository dựa trên LearningPathID
            var existingPathSteps = await _pathStepRepository.GetByLearningPathIDAsync(learningPathID.Value);

            // Tạo một danh sách ID của các PathStep hiện tại trong database
            var existingIds = existingPathSteps.Select(x => x.Id).ToList();

            // Lặp qua các PathStepDto mới
            foreach (var dto in request.PathStepDtos)
            {
                // Tìm PathStep cũ trong database với cùng LearningPathId và CourseId
                var existingPathStep = existingPathSteps
                    .FirstOrDefault(x => x.CourseId.Value == dto.CourseId); // So sánh Guid bên trong CourseId

                if (existingPathStep == null)
                {
                    // Nếu không tìm thấy PathStep cũ, tạo mới PathStep trong database
                    var newPathStep =  PathStep.Create(
                             learningPathId: LearningPathId.Of(dto.LearningPathId), // Sử dụng LearningPathId từ DTO
                            courseId: CourseId.Of(dto.CourseId), // Sử dụng CourseId từ DTO
                            stepOrder: dto.StepOrder, // Sử dụng stepOrder đã tính toán
                            status: PathStepStatus.NotStarted, // Sử dụng trạng thái InProgress
                            enrollmentDate: null, // Sử dụng EnrollmentDate từ DTO
                            expectedCompletionDate: DateTime.UtcNow // Sử dụng ExpectedCompletionDate từ DTO
                                );

                    // Tạo PathStep mới từ DTO
                    await _pathStepRepository.AddAsync(newPathStep);
                }
                else
                {
                    // Nếu tìm thấy PathStep cũ, cập nhật StepOrder mới nếu có thay đổi
                    if (existingPathStep.StepOrder != dto.StepOrder)
                    {
                        existingPathStep.StepOrder = dto.StepOrder;
                        await _pathStepRepository.UpdateAsync(existingPathStep); // Đánh dấu là cập nhật
                    }

                    // Xóa PathStep khỏi danh sách cũ để tránh việc xóa sai
                    existingIds.Remove(existingPathStep.Id);
                }
            }

            // Xóa các PathStep thừa ra từ danh sách cũ mà không có trong danh sách mới
            foreach (var idToRemove in existingIds)
            {
                var pathStepToRemove = existingPathSteps.FirstOrDefault(x => x.Id == idToRemove);
                if (pathStepToRemove != null)
                {
                    await _pathStepRepository.DeleteAsync(pathStepToRemove); // Đánh dấu là xóa
                }
            }

            // Save changes cho tất cả các PathStep đã cập nhật hoặc xóa
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
