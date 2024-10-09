using BuildingBlocks.ValueObjects;

namespace Course.Domain.Models;
public class Quiz : Aggregate<QuizId> {
    public LectureId LectureId { get; set; } = default!; // unique mỗi quiz có thể thuộc về một lecture
    public UserAssessmentId UserAssessmentId { get; set; } = default!; // unique - mỗi quiz có thể thuộc về một bài đánh giá đánh giá tổng hợp nào đó
    public bool IsActive { get; set; }
    public bool IsPublished {  get; set; }
    public bool IsRandomized {  get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public long PassingMark { get; set; } = default!;
    public long TimeLimit {  get; set; } = default!;
}

