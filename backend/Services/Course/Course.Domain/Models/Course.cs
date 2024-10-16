using Course.Domain.Events;

namespace Course.Domain.Models;
public class Course : Aggregate<CourseId> {

    private readonly List<Chapter> _chapters = new();
    public IReadOnlyList<Chapter> Chapters => _chapters.AsReadOnly();

    private readonly List<DiscountCode> _discountCodes = new();
    public IReadOnlyList<DiscountCode> DiscountCodes => _discountCodes.AsReadOnly();
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Headline { get; set; } = default!; //Tên dưới title
    public CourseStatus CourseStatus { get; set; } = CourseStatus.Published; // trạng thái khóa học thế nào
    public double TimeEstimation { get; set; } // ước lượng thời gian để học khóa học này
    public string Prerequisites { get; set; } = default!; // để tham gia khóa học thì cần một vài yêu cầu trước
    public string Objectives { get; set; } = default!; // mục tiêu sẽ đạt được sau khi học khóa học
    public string TargetAudiences { get; set; } = default!; // nhắm tới những đối tượng nào
    public DateTime? ScheduledPublishDate { get; set; } = default!; // lập lịch thời gian ra mắt khóa học
    public string ImageUrl { get; set; } = default!; // Ảnh demo khóa học
    public int OrderIndex { get; set; } // Vị trí  trong các level
    public CourseLevel CourseLevel { get; set; } = CourseLevel.Basic;
    public double Price {  get; set; } // giá bán của khóa học

    public static Course Create(string title, string description, string headline, double timeEstimation, 
        string prerequisites, string objectives, string targetAudiences, string imageUrl, int orderIndex) {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(headline);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(timeEstimation);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(orderIndex);
        var course = new Course() {
            Title = title, 
            Description = description,
            Headline = headline,
            TimeEstimation = timeEstimation, 
            Prerequisites = prerequisites,
            Objectives = objectives,
            TargetAudiences = targetAudiences,
            ImageUrl = imageUrl
        };
        course.AddDomainEvent(new CourseCreatedEvent(course));
        return course;
    }

    public Chapter AddChapter(string title, string description, double timeEstimation, int orderIndex, bool isActive) {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(timeEstimation);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(orderIndex);
        var chapter = new Chapter() {
            CourseId = Id,
            Title = title,
            Description = description,
            TimeEstimation = timeEstimation,
            OrderIndex = orderIndex,
            IsActive = isActive
        };
        _chapters.Add(chapter);
        return chapter;
    }

}

