using System.Text.Json;

namespace Learning.Domain.Models;
public class QuizSubmission : Entity<QuizSubmissionId>{
    public UserId UserId { get; set; } = default!;
    public QuizId QuizId { get; set; } = default!;
    public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    public long Score { get; set; }
    public int TotalQuestions {  get; set; }
    public int CorrectAnswers { get; set; }
    public int IncorrectAnswers {  get; set; }
    public long Duration {  get; set; } // tính bằng giây
    public JsonDocument Answers { get; set; } = default!;
}

