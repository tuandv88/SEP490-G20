namespace BuildingBlocks.Messaging.Events.AIs;
public record PathwayGeneratedEvent: IntegrationEvent {
    public Guid UserId { get; set; }
    public string PathwayName { get; set; } = string.Empty;
    public List<PathStepGenerated> PathSteps { get; set; } = [];
    public string Reason { get; set; } = string.Empty;
    public TimeSpan EstimatedCompletionTime { get; set; }
}

public record PathStepGenerated {
    public Guid CourseId { get; set; }
    public TimeSpan EstimatedCompletionTime { get; set; }
}