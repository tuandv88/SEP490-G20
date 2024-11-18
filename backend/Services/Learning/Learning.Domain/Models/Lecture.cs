
using Learning.Domain.Events.Lectures;

namespace Learning.Domain.Models;
public class Lecture : Aggregate<LectureId> {
    public ChapterId ChapterId { get; set; } = default!;
    public ProblemId? ProblemId { get; set; } = default!; // Unique
    public QuizId? QuizId { get; set; } = default!; // Unique
    public List<LectureProgress> LectureProgress = new();

    public List<LectureComment> LectureComments = new();
    public List<File> Files = new();
    public string Title { get; set; } = default!;
    public string Summary { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public LectureType LectureType { get; set; } = LectureType.Lesson;
    public int OrderIndex {  get; set; }
    public int Point {  get; set; } // điểm thường
    public bool IsFree {  get; set; } // bài học này có miễn phí hay không ?

    public static Lecture Create(LectureId lectureId, ChapterId chapterId, string title, string summary, double timeEstimation, LectureType lectureType, int orderIndex, int point, bool isFree) {
        var lecture = new Lecture() {
            Id = lectureId,
            ChapterId = chapterId,
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

    public void AddFile(File file) {
        Files.Add(file);
        AddDomainEvent(new FileAddedToLectureEvent(file));
    }

    public void DeleteFile(FileId fileId) {
        var file = Files.FirstOrDefault(f => f.Id == fileId);
        if (file == null) {
            throw new Exception("File not found");
        }

        Files.Remove(file);
        AddDomainEvent(new FileDeletedInLectureEvent(file));
    }

}
