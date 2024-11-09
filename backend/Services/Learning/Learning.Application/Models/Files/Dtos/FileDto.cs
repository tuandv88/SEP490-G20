namespace Learning.Application.Models.Files.Dtos;
public record FileDto(
    Guid FileId,
    string FileName,
    long FileSize,
    string FileType,
    double? Duration
);
