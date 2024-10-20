namespace Learning.Domain.Models;
public class Quiz : Aggregate<QuizId> {
    private readonly List<Question>_question = new();
    public IReadOnlyList<Question> Questions => _question.AsReadOnly();
    private readonly List<QuizSubmission> _quizSubmissions = new();
    public IReadOnlyList<QuizSubmission> QuizSubmissions => _quizSubmissions.AsReadOnly();
    public bool IsActive { get; set; }
    public bool IsRandomized {  get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int PassingMark { get; set; } = default!;
    public double TimeLimit {  get; set; } = default!; // giới hạn thời gian làm bài
    public bool HasTimeLimit { get; set; } = false; // xác định xem có giới hạn thời gian làm bài không 
    public int AttemptLimit { get; set; } = 1;
    public bool HasAttemptLimit { get; set; } = false;
    public QuizType QuizType { get; set; } = QuizType.PRACTICE;
}

