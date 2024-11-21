using Learning.Domain.Events;

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
        string prerequisites, string objectives, string targetAudiences, string imageUrl, int orderIndex, CourseLevel courseLevel, double price) {
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
            ImageUrl = imageUrl,
            OrderIndex = orderIndex,
            CourseLevel = courseLevel,
            Price = price
        };
        return course;
    }

    public void Update(string title, string description, string headline, double timeEstimation, string prerequisites, string objectives, string targetAudiences, DateTime? scheduledPublishDate, double price) {
        Title = title;
        Description = description;
        Headline = headline;
        TimeEstimation = timeEstimation;
        Prerequisites = prerequisites;
        Objectives = objectives;
        TargetAudiences = targetAudiences;
        ScheduledPublishDate = scheduledPublishDate;
        Price = price;
    }
    public void UpdateImage(string imageUrl) {
        ImageUrl = imageUrl;
    }

    public void UpdateOrderIndex(int orderIndex) {
        OrderIndex = orderIndex;
    }

    public void UpdateStatus(CourseStatus status) {
        if(CourseStatus == CourseStatus.Scheduled && status != CourseStatus.Scheduled) {
            //Hủy lập lịch nếu khóa đó đã được lập lịch
            AddDomainEvent(new CourseCancelScheduleEvent(this));
        }
        CourseStatus = status;
        AddDomainEvent(new CourseUpdatedStatusEvent(this));
    }
    public void UpdateSchedule(DateTime dateTime) {
        ScheduledPublishDate = dateTime;
    }
    public void UpdateCourseLevel(CourseLevel courseLevel, int orderIndex) {
        CourseLevel = courseLevel;
        OrderIndex = orderIndex;
    }
    public void AddChapter(Chapter chapter) {
        Chapters.Add(chapter);
    }
    public Chapter UpdateChapter(ChapterId chapterId, string title, string description, double timeEstimation, bool isActive) {
        var chapter = Chapters.FirstOrDefault(c => c.Id == chapterId);
        if (chapter == null) {
            throw new NotFoundException("Chapter not found", chapterId.Value);
        }
        chapter.Title = title;
        chapter.Description = description;
        chapter.TimeEstimation = timeEstimation;
        chapter.IsActive = isActive;
        return chapter;
    }

    public Chapter DeleteChapter(ChapterId chapterId) {
        var chapter = Chapters.FirstOrDefault(c => c.Id == chapterId);
        if (chapter == null) {
            throw new Exception("Chapter not found");
        }

        Chapters.Remove(chapter);
        return chapter;
    }

    public void UpdateOrderIndexChapter(Chapter chapter, int orderIndex) {
        chapter.OrderIndex = orderIndex;
    }
}

