
namespace Learning.Domain.Models;
public class Chapter : Aggregate<ChapterId> {
    private readonly List<Lecture> _lectures = new();
    public IReadOnlyList<Lecture> Lectures => _lectures.AsReadOnly();
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
        _lectures.Add(lecture);
    }
}
