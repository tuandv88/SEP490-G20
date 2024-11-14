using MediatR;

namespace Learning.Domain.Abstractions;
public interface IDomainEvent : INotification {
    Guid EventId => Guid.NewGuid();
    public DateTime OccurredAt => DateTime.Now;
    public string EventType => GetType().AssemblyQualifiedName!;
}

