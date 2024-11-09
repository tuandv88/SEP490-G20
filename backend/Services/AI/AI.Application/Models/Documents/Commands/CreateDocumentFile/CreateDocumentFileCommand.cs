using AI.Application.Common.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Http;

public record CreateDocumentFileCommand(IEnumerable<IFormFile> Files) : ICommand<CreateDocumentFileResult>;

public record CreateDocumentFileResult(List<Guid> DocumentIds);

public class CreateDocumentFileCommandValidator : AbstractValidator<CreateDocumentFileCommand> {
    public CreateDocumentFileCommandValidator() {
        RuleFor(x => x.Files)
            .NotNull().WithMessage("Files cannot be null.")
            .NotEmpty().WithMessage("Files cannot be empty.")
            .Must(HaveValidFiles).WithMessage("Each file must be of type PDF, Word, PowerPoint, or Excel.");
    }

    private bool HaveValidFiles(IEnumerable<IFormFile> files) {
        if (files == null || !files.Any()) return false;
        return files.All(file => ContentTypeConstant.Document.AllowedDocumentTypes.Contains(file.ContentType));
    }
}