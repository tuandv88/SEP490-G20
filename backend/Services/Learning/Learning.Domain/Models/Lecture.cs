
namespace Learning.Domain.Models;
public class Lecture : Entity<LectureId> {
    public ChapterId ChapterId { get; set; } = default!;
    public ProblemId? ProblemId { get; set; } = default!; // Unique
    public QuizId? QuizId { get; set; } = default!; // Unique
    private readonly List<LectureProgress> _lectureProgress = new();
    public IReadOnlyList<LectureProgress> LectureProgress => _lectureProgress.AsReadOnly();

    private readonly List<LectureComment> _lectureComment = new();
    public IReadOnlyList<LectureComment> LectureComments => _lectureComment.AsReadOnly();
    private readonly List<File> _files = new();
    public IReadOnlyList<File> Files => _files.AsReadOnly();
    public string Title { get; set; } = default!;
    public string Summary { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public LectureType LectureType { get; set; } = LectureType.Lesson;
    public int OrderIndex {  get; set; }
    public int Point {  get; set; } // điểm thường
    public bool IsFree {  get; set; } // bài học này có miễn phí hay không ?

    public static Lecture Create(LectureId lectureId,  string title, string summary, double timeEstimation, LectureType lectureType, int orderIndex, int point, bool isFree) {
        var lecture = new Lecture() {
            Id = lectureId,
            Title = title,
            Summary = summary,
            TimeEstimation = timeEstimation,
            LectureType = lectureType,
            OrderIndex = orderIndex,
            Point = point,
            IsFree = isFree
        };
        return lecture;
    }
}
