using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Domain.Models
{
    public class PathStep : Aggregate<PathStepId> 
    {
        // Thuộc tính
        public LearningPathId LearningPathId { get; set; }
        public CourseId CourseId { get; set; }
        public int StepOrder { get; set; }
        public PathStepStatus Status { get; set; } // Enum từ User.Domain.Enums
        public DateTime EnrollmentDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public DateTime ExpectedCompletionDate { get; set; }

        // Phương thức khởi tạo tĩnh (static factory method)
        public static PathStep Create(LearningPathId learningPathId, CourseId courseId, int stepOrder, PathStepStatus status, DateTime enrollmentDate, DateTime expectedCompletionDate)
        {
            return new PathStep
            {
                Id = PathStepId.Of(Guid.NewGuid()), // Sử dụng ValueObject cho Id
                LearningPathId = learningPathId,
                CourseId = courseId,
                StepOrder = stepOrder,
                Status = status,
                EnrollmentDate = enrollmentDate,
                ExpectedCompletionDate = expectedCompletionDate,
                CompletionDate = null // Mặc định là chưa hoàn thành
            };
        }

        // Phương thức để cập nhật trạng thái của PathStep
        public void UpdateStatus(PathStepStatus newStatus)
        {
            Status = newStatus;
        }

        // Phương thức để cập nhật CompletionDate khi hoàn thành
        public void MarkAsComplete(DateTime completionDate)
        {
            Status = PathStepStatus.Complete; // Enum cho trạng thái hoàn thành
            CompletionDate = completionDate;
        }
    }
}
