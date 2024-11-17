using Learning.Domain.Models;

namespace Learning.Domain.Events.Chapters;
public record ChapterUpdatedEvent(Chapter Chapter) : IDomainEvent;
