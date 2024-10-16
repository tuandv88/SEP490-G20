namespace Course.Domain.Models;
public class Chapter : Aggregate<ChapterId> {
    private readonly List<Lecture> _lectures = new();
    public IReadOnlyList<Lecture> Lectures => _lectures.AsReadOnly();
    public CourseId CourseId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; } = true;

    public static Chapter Create(CourseId courseId, string title, string description, double timeEstimation, int orderIndex) {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(timeEstimation);
        if (orderIndex < 0) {
            throw new ArgumentException("Orderindex must be positive", nameof(timeEstimation));
        }
        var chapter = new Chapter() {
            CourseId = courseId,
            Title = title,
            Description = description,
            TimeEstimation = timeEstimation,
            OrderIndex = orderIndex
        };
        return chapter;
    }

}
