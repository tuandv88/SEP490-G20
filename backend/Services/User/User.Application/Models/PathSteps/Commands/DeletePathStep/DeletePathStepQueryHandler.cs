using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories; // Repository Interface
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;

namespace User.Application.Models.PathSteps.Commands.DeletePathStep
{
    public class DeletePathStepQueryHandler : IQueryHandler<DeletePathStepQuery, bool>
    {
        private readonly IPathStepsRepository _pathStepRepository;

        // Constructor để inject repository
        public DeletePathStepQueryHandler(IPathStepsRepository pathStepRepository)
        {
            _pathStepRepository = pathStepRepository;
        }

        // Phương thức xử lý xóa PathStep theo PathStepId
        public async Task<bool> Handle(DeletePathStepQuery request, CancellationToken cancellationToken)
        {
            // Lấy PathStep cần xóa từ repository
            var pathStep = await _pathStepRepository.GetByPathStepIdAsync(request.PathStepId);

            // Nếu không tìm thấy PathStep, ném ngoại lệ
            if (pathStep == null)
            {
                throw new NotFoundException("PathStep", request.PathStepId);
            }

            // Xóa PathStep
            await _pathStepRepository.DeleteAsync(pathStep);

            // Lưu thay đổi sau khi xóa
            await _pathStepRepository.SaveChangesAsync(cancellationToken);

            // Trả về true nếu việc xóa thành công
            return true;
        }
    }
}
