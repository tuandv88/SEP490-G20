using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.UserGoals.Dtos;
using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Application.Models.UserGoals.Commands.CreateUserGoal
{
    public class CreateUserGoalHandler : IRequestHandler<CreateUserGoalCommand, CreateUserGoalResult>
    {
        private readonly IUserGoalRepository userGoalRepository;

        public CreateUserGoalHandler(IUserGoalRepository userGoalRepository)
        {
            this.userGoalRepository = userGoalRepository;
        }

        public async Task<CreateUserGoalResult> Handle(CreateUserGoalCommand request, CancellationToken cancellationToken)
        {
            // Tạo mới đối tượng UserGoal
            var userGoal = CreateNewUserGoal(request.UserId, request.UserGoalDto);

            // Thêm vào cơ sở dữ liệu
            await userGoalRepository.AddAsync(userGoal);
            await userGoalRepository.SaveChangesAsync(cancellationToken);

            // Trả về kết quả với ID của UserGoal vừa tạo
            return new CreateUserGoalResult(userGoal.Id.Value);
        }

        private UserGoal CreateNewUserGoal(Guid userId, UserGoalDto userGoalDto)
        {
            if (!Enum.TryParse<GoalType>(userGoalDto.GoalType, true, out var goalType))
            {
                // Ghi lại lỗi để dễ dàng kiểm tra
                throw new ArgumentException($"Invalid GoalType provided: {userGoalDto.GoalType}. Please ensure the value is valid.");
            }

            return UserGoal.Create(
                userGoalId: UserGoalId.Of(Guid.NewGuid()),
                userId: UserId.Of(userGoalDto.UserId),
                goalType: goalType,
                targetDate: userGoalDto.TargetDate,
                status: userGoalDto.Status
            );
        }
    }
}
