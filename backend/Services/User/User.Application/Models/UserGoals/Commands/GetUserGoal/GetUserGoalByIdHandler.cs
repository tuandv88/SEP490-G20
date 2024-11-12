using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;  // Repository Interface
using User.Application.Models.UserGoals.Dtos; // UserGoalDto
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions; // CQRS Interfaces

namespace User.Application.Models.UserGoals.Commands.GetUserGoal
{
    public class GetUserGoalsByUserIdHandler : IQueryHandler<GetUserGoalsByUserIdQuery, GetUserGoalsByUserIdQueryResult>
    {
        private readonly IUserGoalRepository _userGoalRepository;

        // Constructor để Inject repository vào handler
        public GetUserGoalsByUserIdHandler(IUserGoalRepository userGoalRepository)
        {
            _userGoalRepository = userGoalRepository;
        }

        // Phương thức Handle sẽ xử lý truy vấn GetUserGoalsByUserIdQuery
        public async Task<GetUserGoalsByUserIdQueryResult> Handle(GetUserGoalsByUserIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy tất cả UserGoals từ repository bằng UserId
            var userGoals = await _userGoalRepository.GetByUserIdAsync(request.UserId);

            if (userGoals == null || userGoals.Count == 0)
            {
                // Nếu không tìm thấy bất kỳ UserGoal nào, có thể ném exception hoặc trả về kết quả không tìm thấy
                throw new NotFoundException("UserGoals", request.UserId);
            }

            // Chuyển danh sách UserGoals thành danh sách UserGoalDto (nếu cần chuyển đổi)
            var userGoalDtos = new List<UserGoalDto>();
            foreach (var userGoal in userGoals)
            {
                userGoalDtos.Add(new UserGoalDto(
                    userGoal.Id.Value,
                    userGoal.UserId.Value,
                    userGoal.GoalType.ToString(),
                    userGoal.TargetDate,
                    userGoal.Status
                ));
            }

            // Trả về kết quả Query với danh sách UserGoalDto
            return new GetUserGoalsByUserIdQueryResult(userGoalDtos);
        }
    }
}
