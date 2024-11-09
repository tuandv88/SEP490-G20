using FluentValidation;

namespace AI.Application.Models.Documents.Commands.CreateDocumentWeb;
public record CreateDocumentWebCommand(List<string> Urls) : ICommand<CreateDocumentWebResult>;
public record CreateDocumentWebResult(List<Guid> DocumentIds);

public class CreateDocumentWebCommandValidator : AbstractValidator<CreateDocumentWebCommand> {
    public CreateDocumentWebCommandValidator() {
        RuleFor(command => command.Urls)
            .NotNull().WithMessage("The URL list cannot be null.")
            .NotEmpty().WithMessage("The URL list cannot be empty.")
            .Must(urls => urls.Count <= 10).WithMessage("The URL list cannot contain more than 5 URLs.");
    }
}