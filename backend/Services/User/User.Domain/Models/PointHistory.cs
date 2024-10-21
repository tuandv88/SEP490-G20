using User.Domain.Enums;
using User.Domain.ValueObjects;

namespace User.Domain.Models
{
    public class PointHistory : Aggregate<PointHistoryId> 
    {
        // Thuộc tính
        public Guid UserId { get; private set; }
        public long Point { get; private set; }
        public ChangeType ChangeType { get; private set; } // Enum từ User.Domain.Enums
        public string Source { get; private set; } = string.Empty;
        public DateTime DateReceived { get; private set; }
        public DateTime LastUpdated { get; private set; }

        // Phương thức khởi tạo tĩnh (static factory method)
        public static PointHistory Create(PointHistoryId pointHistoryId, Guid userId, long point, ChangeType changeType, string source, DateTime dateReceived, DateTime lastUpdated)
        {
            if (point <= 0)
            {
                throw new ArgumentException("Point must be greater than zero.");
            }

            return new PointHistory
            {
                Id = pointHistoryId,
                UserId = userId,
                Point = point,
                ChangeType = changeType,
                Source = source,
                DateReceived = dateReceived,
                LastUpdated = lastUpdated
            };
        }

        // Phương thức cập nhật điểm
        public void UpdatePoints(long newPoint)
        {
            if (newPoint <= 0)
            {
                throw new ArgumentException("New point must be greater than zero.");
            }

            Point = newPoint;
            LastUpdated = DateTime.UtcNow; // Cập nhật thời gian thay đổi
        }

        // Phương thức cập nhật nguồn gốc của điểm
        public void UpdateSource(string newSource)
        {
            if (string.IsNullOrWhiteSpace(newSource))
            {
                throw new ArgumentException("Source cannot be empty.");
            }

            Source = newSource;
            LastUpdated = DateTime.UtcNow;
        }

        // Phương thức thay đổi kiểu thay đổi (ChangeType)
        public void UpdateChangeType(ChangeType newChangeType)
        {
            ChangeType = newChangeType;
            LastUpdated = DateTime.UtcNow;
        }
    }
}
