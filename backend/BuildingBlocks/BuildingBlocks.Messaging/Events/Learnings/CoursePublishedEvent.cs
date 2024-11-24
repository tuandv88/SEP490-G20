namespace BuildingBlocks.Messaging.Events.Learnings;
public record CoursePublishedEvent(CourseData Course) : IntegrationEvent;

public record CourseData {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Headline { get; set; }
    public string CourseStatus { get; set; }
    public double TimeEstimation { get; set; }
    public string Prerequisites { get; set; } = default!;
    public string Objectives { get; set; } = default!;
    public string TargetAudiences { get; set; } = default!;
    public DateTime? ScheduledPublishDate { get; set; }
    public string ImageUrl { get; set; } = default!;
    public int OrderIndex { get; set; }
    public string CourseLevel { get; set; }
    public double Price { get; set; }
    public List<ChapterData> Chapters { get; set; }
}
public record ChapterData {
    public Guid Id { get; set; }
    public Guid CourseId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public int OrderIndex { get; set; }
    public List<LectureData> Lectures {  get; set; }
}
public record LectureData {
    public Guid Id { get; set; }
    public Guid ChapterId { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Summary { get; set; } = default!;
    public double TimeEstimation { get; set; }
    public string LectureType { get; set; } = default!;
    public int OrderIndex { get; set; }
    public int Point { get; set; }
    public bool IsFree { get; set; }
    public List<File> Files { get; set; } = [];
}

public record ProblemData {
    //TODO
}

public record File {
    public Guid Id { get; set; }
    public string FileName { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string Format { get; set; } = default!;
    public long FileSize { get; set; } = default!;
}