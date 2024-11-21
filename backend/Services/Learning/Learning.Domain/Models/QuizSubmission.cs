using Learning.Domain.Events;

namespace Learning.Domain.Models;
public class QuizSubmission : Aggregate<QuizSubmissionId>{
    public UserId UserId { get; set; } = default!;
    public QuizId QuizId { get; set; } = default!;
    public DateTime StartTime { get; set; } = DateTime.UtcNow; 
    public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    public long Score { get; set; }
    public int TotalQuestions {  get; set; }
    public int CorrectAnswers { get; set; }
    public int IncorrectAnswers {  get; set; }
    public long Duration => (long)(SubmissionDate - StartTime).TotalSeconds;
    public List<QuestionAnswer>? Answers { get; set; } = default!;
    public QuizSubmissionStatus Status = QuizSubmissionStatus.InProgress;

    public void UpdateStatus(QuizSubmissionStatus status) {
        Status = status;
        AddDomainEvent(new QuizSubmissionUpdateStatusEvent(this));
    }
    public void UpdateAnswers(QuestionAnswer answer) {
        if (Answers == null) {
            Answers = new List<QuestionAnswer>();
        }

        var existingAnswer = Answers.FirstOrDefault(a => a.Id == answer.Id);

        if (existingAnswer != null) {
            existingAnswer.Content = answer.Content;
            existingAnswer.Choices = answer.Choices;
            existingAnswer.UserAnswers = answer.UserAnswers;
            existingAnswer.Problem = answer.Problem;
        } else {
            Answers.Add(answer);
        }
    }
}

