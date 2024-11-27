
namespace User.Domain.Models
{
    public class LearningPath : Aggregate<LearningPathId>
    {
        public UserId UserId { get; set; }
        public string PathName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public LearningPathStatus Status { get; set; } // Enum từ User.Domain.Enums
        public List<PathStep> PathSteps { get; set; } = new List<PathStep>();

        // Phương thức khởi tạo tĩnh (static factory method)
        public static LearningPath Create(LearningPathId learningPathId, UserId userId, string pathName, DateTime startDate, DateTime endDate, LearningPathStatus status)
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
        public void AddPathSteps(List<PathStep> pathSteps) {
            PathSteps.AddRange(pathSteps);
        }
    }
}
