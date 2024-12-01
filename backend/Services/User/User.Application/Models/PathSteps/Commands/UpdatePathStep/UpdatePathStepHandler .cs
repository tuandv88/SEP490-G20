using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.PathSteps.Dtos;
using BuildingBlocks.Exceptions;
using User.Domain.ValueObjects;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
            var dto = request.PathStepDto;

            // Lấy PathStep cần cập nhật từ repository
            var pathStep = await _pathStepRepository.GetByPathStepIdAsync(dto.Id);

            if (pathStep == null)
            {
                throw new NotFoundException($"PathStep với Id '{dto.Id}' không tồn tại.");
            }

            // Cập nhật các thuộc tính của PathStep  
            pathStep.CourseId = new CourseId(dto.CourseId);
            pathStep.StepOrder = dto.StepOrder;
            pathStep.Status = dto.Status;
            pathStep.EnrollmentDate = dto.EnrollmentDate;
            pathStep.CompletionDate = dto.CompletionDate;
            pathStep.ExpectedCompletionDate = dto.ExpectedCompletionDate;

            await _pathStepRepository.SaveChangesAsync(cancellationToken);
            

            return true;
        }
    }
}
