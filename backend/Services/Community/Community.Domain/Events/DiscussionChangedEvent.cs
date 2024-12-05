using Community.Domain.Models;

namespace Community.Domain.Events;
public record DiscussionChangedEvent(Discussion Discussion):IDomainEvent;

