namespace BuildingBlocks.Messaging.Events.Learnings;
public record AssessmentQuizScoringCompletedEvent : IntegrationEvent {
    public Guid QuizSubmissionId {  get; set; }
    public Guid UserId { get; set; }
    public Guid QuizId { get; set; }
    public DateTime StartTime { get; set; } 
    public DateTime SubmissionDate { get; set; }
    public long Score { get; set; }
    public long TotalScore { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int PassingMark { get; set; }
    public string ResultAnswers { get; set; } = default!;
}


