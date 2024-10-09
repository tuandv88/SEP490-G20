namespace Course.Domain.Models;
public class QuestionOption : Entity<QuestionOptionId>{
    public string Content { get; set; } = default!;
    public bool IsCorrect {  get; set; }
    public int OrderIndex {  get; set; }
}

