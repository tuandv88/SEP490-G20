using Learning.Domain.Events.Chapters;
using Learning.Domain.Events.Courses;

namespace Learning.Domain.Models;
public class Course : Aggregate<CourseId> {

    public List<Chapter> Chapters = new();
    public List<UserCourse> UserCourses = new();
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
    
    public static Course Create(CourseId courseId, string title, string description, string headline, CourseStatus courseStatus, double timeEstimation, 
        string prerequisites, string objectives, string targetAudiences, DateTime? scheduledPublishDate, string imageUrl, int orderIndex, CourseLevel courseLevel, double price) {
        var course = new Course() {
            Id = courseId,
            Title = title, 
            Description = description,
            Headline = headline,
            CourseStatus = courseStatus,
            TimeEstimation = timeEstimation, 
            Prerequisites = prerequisites,
            Objectives = objectives,
            TargetAudiences = targetAudiences,
            ScheduledPublishDate = scheduledPublishDate,
            ImageUrl = imageUrl,
            OrderIndex = orderIndex,
            CourseLevel = courseLevel,
            Price = price
        };
        course.AddDomainEvent(new CourseCreatedEvent(course));
        return course;
    }

    public void Update(string title, string description, string headline, CourseStatus courseStatus, double timeEstimation, string prerequisites, string objectives, string targetAudiences, DateTime? scheduledPublishDate, int orderIndex, CourseLevel courseLevel, double price) {
        Title = title;
        Description = description;
        Headline = headline;
        CourseStatus = courseStatus;
        TimeEstimation = timeEstimation;
        Prerequisites = prerequisites;
        Objectives = objectives;
        TargetAudiences = targetAudiences;
        ScheduledPublishDate = scheduledPublishDate;
        OrderIndex = orderIndex;
        CourseLevel = courseLevel;
        Price = price;

        AddDomainEvent(new CourseUpdatedEvent(this));
    }
    public void UpdateImage(string imageUrl) {
        ImageUrl = imageUrl;
    }

    public void UpdateOrderIndex(int orderIndex) {
        OrderIndex = orderIndex;
        AddDomainEvent(new CourseUpdatedEvent(this));
    }


    public void AddChapter(Chapter chapter) {
        Chapters.Add(chapter);
        chapter.AddDomainEvent(new ChapterCreatedEvent(chapter));

    }
    public Chapter UpdateChapter(ChapterId chapterId, string title, string description, double timeEstimation, int orderIndex, bool isActive) {
        var chapter = Chapters.FirstOrDefault(c => c.Id == chapterId);
        if (chapter == null) {
            throw new NotFoundException("Chapter not found", chapterId.Value);
        }
        chapter.Title = title;
        chapter.Description = description;
        chapter.TimeEstimation = timeEstimation;
        chapter.OrderIndex = orderIndex;
        chapter.IsActive = isActive;

        chapter.AddDomainEvent(new ChapterUpdatedEvent(chapter));
        return chapter;
    }

    public Guid DeleteChapter(ChapterId chapterId) {
        var chapter = Chapters.FirstOrDefault(c => c.Id == chapterId);
        if (chapter == null) {
            throw new Exception("Chapter not found");
        }

        Chapters.Remove(chapter);

        chapter.AddDomainEvent(new ChapterDeletedEvent(chapter));
        return chapter.Id.Value;
    }

}

