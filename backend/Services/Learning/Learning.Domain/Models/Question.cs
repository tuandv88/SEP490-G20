namespace Learning.Domain.Models;
public class Question : Aggregate<QuestionId> {
    public QuizId QuizId { get; set; } = default!;
    public  List<QuestionOption> QuestionOptions = new();
    public ProblemId? ProblemId { get; set; } = default!;
    public bool IsActive {  get; set; }
    public string Content { get; set; } = default!;
    public QuestionType QuestionType = QuestionType.MultipleChoice;
    public QuestionLevel QuestionLevel { get; set; } = QuestionLevel.EASY;
    public int Mark { get; set; } = 1;
    public int OrderIndex { get; set; }
}

