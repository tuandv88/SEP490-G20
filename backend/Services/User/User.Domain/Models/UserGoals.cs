using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Domain.Models
{
    public class UserGoal : Aggregate<UserGoalId> // Sử dụng ValueObject cho Id
    {
        // Thuộc tính
        public Guid UserId { get; private set; }
        public GoalType GoalType { get; private set; } // Enum từ User.Domain.Enums
        public DateTime TargetDate { get; private set; }
        public GoalStatus Status { get; private set; } // Enum từ User.Domain.Enums

        // Phương thức khởi tạo tĩnh (static factory method)
        public static UserGoal Create(UserGoalId userGoalId, Guid userId, GoalType goalType, DateTime targetDate, GoalStatus status)
        {
            if (targetDate <= DateTime.UtcNow)
            {
                throw new ArgumentException("Target date must be in the future.");
            }

            return new UserGoal
            {
                Id = userGoalId,
                UserId = userId,
                GoalType = goalType,
                TargetDate = targetDate,
                Status = status
            };
        }

        // Phương thức cập nhật trạng thái của mục tiêu
        public void UpdateStatus(GoalStatus newStatus)
        {
            Status = newStatus;
        }

        // Phương thức thay đổi ngày mục tiêu
        public void UpdateTargetDate(DateTime newTargetDate)
        {
            if (newTargetDate <= DateTime.UtcNow)
            {
                throw new ArgumentException("Target date must be in the future.");
            }

            TargetDate = newTargetDate;
        }
    }
}
