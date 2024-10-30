namespace Community.Domain.Events;
public record CategoryCreatedEvent(Models.Category Category) : IDomainEvent;
