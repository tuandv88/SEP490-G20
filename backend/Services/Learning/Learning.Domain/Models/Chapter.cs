
using Learning.Domain.Events.Lectures;

namespace Learning.Domain.Models;
public class Chapter : Aggregate<ChapterId> {
    public List<Lecture> Lectures = new();
    public CourseId CourseId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; } = true;

    public static Chapter Create(CourseId courseId, ChapterId chapterId, string title, string description, double timeEstimation, int orderIndex) {
        var chapter = new Chapter() {
            CourseId = courseId,
            Id = chapterId,
            Title = title,
            Description = description,
            TimeEstimation = timeEstimation,
            OrderIndex = orderIndex
        };
        //Thêm event nếu cần
        return chapter;
    }

    public void AddLecture(Lecture lecture) {
        Lectures.Add(lecture);
        lecture.AddDomainEvent(new LectureCreatedEvent(lecture));
    }
    public Lecture UpdateLecture(LectureId lectureId, string title, string summary, double timeEstimation, LectureType lectureType, int orderIndex, int point, bool isFree) {
        var lecture = Lectures.FirstOrDefault(l => l.Id == lectureId);
        if (lecture == null) {
            throw new NotFoundException("Lecture not found", lectureId.Value);
        }

        lecture.Title = title;
        lecture.Summary = summary;
        lecture.TimeEstimation = timeEstimation;
        lecture.LectureType = lectureType;
        lecture.OrderIndex = orderIndex;
        lecture.Point = point;
        lecture.IsFree = isFree;

        lecture.AddDomainEvent(new LectureUpdatedEvent(lecture));
        return lecture;
    }

    public Lecture DeleteLecture(LectureId lectureId) {
        var lecture = Lectures.FirstOrDefault(l => l.Id == lectureId);
        if (lecture == null) {
            throw new NotFoundException("Lecture not found", lectureId.Value);
        }

        Lectures.Remove(lecture);

        lecture.AddDomainEvent(new LectureDeletedEvent(lecture));
        return lecture;
    }

    public void UpdateOrderIndexLecture(Lecture lecture, int orderIndex) {
        lecture.OrderIndex = orderIndex;
        lecture.AddDomainEvent(new LectureUpdatedEvent(lecture));
    }

}
