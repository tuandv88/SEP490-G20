namespace Course.Domain.Models;
public class Question : Aggregate<QuestionId> {
    public bool IsActive {  get; set; }
    public string Content { get; set; } = default!;
    public QuestionType QuestionType = QuestionType.MultipleChoice;
    public int Mark { get; set; } = 1;
    public int OrderIndex { get; set; }
}

