namespace Learning.Domain.Models;
public class Quiz : Aggregate<QuizId> {
    public List<Question> Questions = new();
    public List<QuizSubmission> QuizSubmissions = new();
    public bool IsActive { get; set; }
    public bool IsRandomized { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int PassingMark { get; set; } = default!;
    public double TimeLimit { get; set; } = default!; // giới hạn thời gian làm bài
    public bool HasTimeLimit { get; set; } = false; // xác định xem có giới hạn thời gian làm bài không 
    public int AttemptLimit { get; set; } = 1;
    public bool HasAttemptLimit { get; set; } = false;
    public QuizType QuizType { get; set; } = QuizType.PRACTICE;
    public static Quiz Create(QuizId quizId, bool isActive, bool isRandomized, string title, string description, int passingMark, double timeLimit, bool hasTimeLimit, int attemptLimit, bool hasAttemptLimit, QuizType quizType) {
        var quiz = new Quiz() {
            Id = quizId,
            IsActive = isActive,
            IsRandomized = isRandomized,
            Title = title,
            Description = description,
            PassingMark = passingMark,
            TimeLimit = timeLimit,
            HasTimeLimit = hasTimeLimit,
            AttemptLimit = attemptLimit,
            HasAttemptLimit = hasAttemptLimit,
            QuizType = quizType,
        };
        return quiz;
    }
    public void AddQuestion(Question question) {
        Questions.Add(question);
    }
}

