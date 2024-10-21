namespace Learning.Domain.Models;
public class File : Entity<FileId> {
    public LectureId LectureId { get; set; } = default!;
    public string FileName { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string Format { get; set; } = default!;
    public long FileSize { get; set; } = default!;
    public bool IsActive { get; set; } = true;
    public FileType FileType { get; set; } = FileType.DOCUMENT;
    public double? Duration { get; set; } = default!;

    public static File Create(FileId id, LectureId lectureId, string fileName, string url, string format, long fileSize, bool isActive, FileType fileType, double? duration) {
        var file = new File() {
            Id = id,
            LectureId = lectureId,
            FileName = fileName,
            Url = url,
            Format = format,
            FileSize = fileSize,
            IsActive = isActive,
            FileType = fileType,
            Duration = duration,
        };
        return file;
    }
}


