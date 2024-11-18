using MediatR;

namespace Learning.Domain.Abstractions;
public interface IDomainEvent : INotification {
    //public Guid Id => Guid.NewGuid();
    //public DateTime OccurredAt => DateTime.Now;
    //public string Type => GetType().AssemblyQualifiedName!;
}

