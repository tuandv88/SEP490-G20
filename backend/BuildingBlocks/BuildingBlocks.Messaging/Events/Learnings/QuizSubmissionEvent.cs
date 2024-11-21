namespace BuildingBlocks.Messaging.Events.Learnings;
public record QuizSubmissionEvent : IntegrationEvent {
    public Guid QuizId { get; set; }
    public Guid UserId { get; set; }
    public Guid SubmissionId { get; set; }
    public List<QuestionAnswerData> Questions { get; set; }
}

public record QuestionAnswerData {
    public Guid Id { get; set; }
    public List<Guid>? AnswerId { get; set; }
    public ProblemAnswerData? Problem { get; set; }

}
public record ProblemAnswerData {
    public Guid Id { set; get; }
    public string LanguageCode { get; set; }
    public string SolutionCode { get; set; }
}