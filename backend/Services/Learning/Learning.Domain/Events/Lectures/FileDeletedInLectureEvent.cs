using File = Learning.Domain.Models.File;

namespace Learning.Domain.Events.Lectures;
public record FileDeletedInLectureEvent(File File) : IDomainEvent;
 