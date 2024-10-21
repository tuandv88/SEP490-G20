
namespace User.Domain.Models
{
    public class LearningPath : Aggregate<LearningPathId>
    {
        public Guid UserId { get; set; }
        public string PathName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public LearningPathStatus Status { get; set; } // Enum từ User.Domain.Enums
        public virtual ICollection<PathStep> PathSteps { get; set; } = new List<PathStep>();

        // Phương thức khởi tạo tĩnh (static factory method)
        public static LearningPath Create(LearningPathId learningPathId, Guid userId, string pathName, DateTime startDate, DateTime endDate, LearningPathStatus status)
        {
            return new LearningPath
            {
                Id = learningPathId,  // Id kiểu LearningPathId (ValueObject)
                UserId = userId,
                PathName = pathName,
                StartDate = startDate,
                EndDate = endDate,
                Status = status
            };
        }
    }
}
