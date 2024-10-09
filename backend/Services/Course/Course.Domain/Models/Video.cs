namespace Course.Domain.Models;
public class Video : FileEntity<VideoId>{
    public LessonId LessonId { get; set; } = default!;
    public double Duration {  get; set; }
}

