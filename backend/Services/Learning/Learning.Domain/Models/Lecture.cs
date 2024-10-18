namespace Learning.Domain.Models;
public class Lecture : Entity<LectureId> {
    public ChapterId ChapterId { get; set; } = default!;
    public LessonId LessonId { get; set; } = default!; // Unique
    public ProblemId ProblemId { get; set; } = default!; // Unique
    public QuizId QuizId { get; set; } = default!; // Unique
    private readonly List<LectureProgress> _lectureProgress = new();
    public IReadOnlyList<LectureProgress> LectureProgress => _lectureProgress.AsReadOnly();

    private readonly List<LectureComment> _lectureComment = new();
    public IReadOnlyList<LectureComment> LectureComments => _lectureComment.AsReadOnly();
    public string Title { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public LectureType LectureType { get; set; } = LectureType.Lesson;
    public int OrderIndex {  get; set; }
    public int Point {  get; set; } // điểm thường
    public bool IsFree {  get; set; } // bài học này có miễn phí hay không ?
}
