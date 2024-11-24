namespace BuildingBlocks.Messaging.Events.AIs;
public record PathwayGeneratedEvent(
    Guid UserId,
    List<PathwayGenerated> Pathways
    
) : IntegrationEvent;

public record PathwayGenerated(
    Guid CourseId, 
    string Reason
);