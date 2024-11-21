namespace Learning.Domain.Models;
public class QuizSubmission : Aggregate<QuizSubmissionId> {
    public UserId UserId { get; set; } = default!;
    public QuizId QuizId { get; set; } = default!;
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    public long Score { get; set; }
    public long TotalScore { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public long Duration => (long)(SubmissionDate - StartTime).TotalSeconds;
    public List<QuestionAnswer>? Answers { get; set; } = default!;
    public QuizSubmissionStatus Status = QuizSubmissionStatus.InProgress;

    public void UpdateStatus(QuizSubmissionStatus status) {
        Status = status;
        switch (status) {
            case QuizSubmissionStatus.Processing:
                // tạo event xử lí submission này (đây là trang thái đã nộp và chờ xử lí ra kết quả)
                //AddDomainEvent(new QuizSubmissionProcessingEvent(Id.Value));
                break;
        }
    }
    public void UpdateSubmitResult(long score,long totalScore, int totalQuestions, int correctAnswers, List<QuestionAnswer>? answers) {
        Score = score;
        TotalScore = TotalScore;
        TotalQuestions = totalQuestions;
        CorrectAnswers = correctAnswers;
        Answers = answers;
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

