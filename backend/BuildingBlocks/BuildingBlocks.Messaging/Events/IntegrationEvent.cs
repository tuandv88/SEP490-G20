namespace BuildingBlocks.Messaging.Events;
public record IntegrationEvent {
    public Guid Id => Guid.NewGuid();
    public DateTime OccurredAt => DateTime.Now;
    public string Type => GetType().AssemblyQualifiedName!;
}

