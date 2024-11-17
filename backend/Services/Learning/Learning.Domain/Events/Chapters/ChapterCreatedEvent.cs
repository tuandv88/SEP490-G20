using Learning.Domain.Models;

namespace Learning.Domain.Events.Chapters;
public record ChapterCreatedEvent(Chapter Chapter) : IDomainEvent;

