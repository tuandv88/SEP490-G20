using File = Learning.Domain.Models.File;

namespace Learning.Domain.Events.Lectures;
public record FileAddedToLectureEvent(File File) : IDomainEvent;

