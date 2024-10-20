using Microsoft.AspNetCore.Http;

namespace Learning.Application.Models.Videos.Commands.CreateVideo;
public record CreateVideoCommand(IFormFile File, double Duration) : ICommand<CreateVideoResult>;
public record CreateVideoResult(Guid Id);

public class CreateVideoCommandValidator : AbstractValidator<CreateVideoCommand> {
    public CreateVideoCommandValidator() {
        RuleFor(command => command.File)
            .NotNull().WithMessage("File is required.")
            .Must(BeAValidVideoFile).WithMessage("Invalid video format. Supported formats: MP4, WebM, Ogg, AVI, MOV.");
        RuleFor(command => command.Duration)
            .GreaterThan(0).WithMessage("Duration must be greater than 0");
    }
    private bool BeAValidVideoFile(IFormFile file) {
        return AllowedVideoFormats.Contains(file.ContentType);
    }
    private static readonly string[] AllowedVideoFormats = {
        "video/mp4",      // MP4
        "video/webm",     // WebM
        "video/ogg",      // Ogg
        "video/x-msvideo", // AVI
        "video/quicktime" // MOV
    };
}