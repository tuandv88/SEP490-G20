using Learning.Domain.Models;

namespace Learning.Domain.Events.Chapters;
public record ChapterDeletedEvent(Chapter Chapter) : IDomainEvent;

