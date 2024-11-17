using FluentValidation;

namespace AI.Application.Models.Documents.Commands.DeleteDocuments;

public record DeleteDocumentsCommand(string[] DocumentIds) : ICommand;

public class DeleteDocumentsCommandValidator : AbstractValidator<DeleteDocumentsCommand> {
    public DeleteDocumentsCommandValidator() {
        RuleFor(command => command.DocumentIds)
            .Must(documentIds => documentIds.All(id => Guid.TryParse(id, out _)))
            .WithMessage("Each DocumentId must be a valid GUID.");
    }
}
