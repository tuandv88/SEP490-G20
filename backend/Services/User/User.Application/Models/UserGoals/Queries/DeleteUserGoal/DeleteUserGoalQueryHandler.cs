using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories; // Repository Interface
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions; // Các exception cho CQRS

namespace User.Application.Models.UserGoals.Queries.DeleteUserGoal
{
    public class DeleteUserGoalQueryHandler : IQueryHandler<DeleteUserGoalQuery, bool>
    {
        private readonly IUserGoalRepository _userGoalRepository;

        // Constructor để inject repository
        public DeleteUserGoalQueryHandler(IUserGoalRepository userGoalRepository)
        {
            _userGoalRepository = userGoalRepository;
        }

        // Phương thức xử lý xóa UserGoal theo UserGoalId
        public async Task<bool> Handle(DeleteUserGoalQuery request, CancellationToken cancellationToken)
        {
            // Lấy UserGoal cần xóa từ repository
            var userGoal = await _userGoalRepository.GetByIdAsync(request.UserGoalId);

            // Nếu không tìm thấy UserGoal, ném ngoại lệ
            if (userGoal == null)
            {
                throw new NotFoundException("UserGoal", request.UserGoalId);
            }

            // Xóa UserGoal
            await _userGoalRepository.DeleteAsync(userGoal);

            // Lưu thay đổi sau khi xóa
            await _userGoalRepository.SaveChangesAsync(cancellationToken);

            // Trả về true nếu việc xóa thành công
            return true;
        }

    }
}
