namespace BuildingBlocks.Messaging.Events.Learnings;
public record RewardPointsGrantedEvent(Guid UserId, int Point, string Source) : IntegrationEvent;

