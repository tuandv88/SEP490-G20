namespace Course.Domain.Models;
public class Lecture : Entity<LectureId> {
    public string Title { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public LectureType LectureType { get; set; } = LectureType.Lesson;
    public int OrderIndex {  get; set; }
    public int Point {  get; set; } // điểm thường
}
