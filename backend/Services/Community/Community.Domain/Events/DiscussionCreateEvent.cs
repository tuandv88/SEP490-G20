using Community.Domain.Abstractions;

namespace Community.Domain.Events;
public record DiscussionCreatedEvent(Models.Discussion Discussion) :IDomainEvent;
