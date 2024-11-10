using Learning.Application.Models.Files.Dtos;
using Learning.Domain.Enums;

namespace Learning.Application.Models.Files.Commands.CreateFile;
public record CreateFileCommand(Guid LectureId, CreateFileDto CreateFileDto) : ICommand<CreateFileResult>;
public record CreateFileResult(Guid Id);

public class CreateFileCommandValidator : AbstractValidator<CreateFileCommand> {
    private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
    private static readonly string[] AllowedVideoExtensions = { ".mp4", ".avi", ".mov" };
    private static readonly string[] AllowedDocumentExtensions = { ".pdf", ".docx", ".xlsx" };

    public CreateFileCommandValidator() {
        RuleFor(x => x.CreateFileDto)
            .NotNull().WithMessage("File information is required.")
            .DependentRules(() => {
                RuleFor(x => x.CreateFileDto.File)
                    .NotNull().WithMessage("File is required.")
                    .Must((dto, file) => BeAValidFileType(dto.CreateFileDto))
                    .WithMessage("Invalid file format for the given file type.");

                RuleFor(x => x.CreateFileDto.FileType)
                    .Must(BeAValidFileTypeString)
                    .WithMessage("Invalid file type. Valid values are: DOCUMENT, IMAGE, VIDEO.");

                RuleFor(x => x.CreateFileDto.Duration)
                    .Must((dto, duration) => ValidateDuration(dto.CreateFileDto.FileType, duration))
                    .WithMessage("Duration is required for VIDEO file type.");
            });
    }

    private bool BeAValidFileType(CreateFileDto createFileDto) {
        var fileExtension = Path.GetExtension(createFileDto.File.FileName).ToLower();
        var contentType = createFileDto.File.ContentType.ToLower();
        var fileType = createFileDto.FileType.ToLower();

        return fileType switch {
            "image" => AllowedImageExtensions.Contains(fileExtension) && IsImageMimeType(contentType),
            "video" => AllowedVideoExtensions.Contains(fileExtension) && IsVideoMimeType(contentType),
            "document" => AllowedDocumentExtensions.Contains(fileExtension) && IsDocumentMimeType(contentType),
            _ => false,
        };
    }

    private bool BeAValidFileTypeString(string fileType) {
        return Enum.TryParse(typeof(FileType), fileType, true, out _);
    }

    private bool ValidateDuration(string fileType, string? duration) {
        if (Enum.TryParse(typeof(FileType), fileType, true, out var parsedFileType) && (FileType)parsedFileType == FileType.VIDEO) {
            return !string.IsNullOrEmpty(duration);
        }
        return true;
    }

    private bool IsImageMimeType(string contentType) {
        var allowedImageMimeTypes = new[] { "image/jpeg", "image/png", "image/gif" };
        return allowedImageMimeTypes.Contains(contentType);
    }

    private bool IsVideoMimeType(string contentType) {
        var allowedVideoMimeTypes = new[] { "video/mp4", "video/x-msvideo", "video/quicktime" };
        return allowedVideoMimeTypes.Contains(contentType);
    }

    private bool IsDocumentMimeType(string contentType) {
        var allowedDocumentMimeTypes = new[] { "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
        return allowedDocumentMimeTypes.Contains(contentType);
    }
}

