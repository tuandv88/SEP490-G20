namespace AI.Application.Models.Documents.Commands.CreateDocumentText;
public record CreateDocumentTextCommand(string Text): ICommand<CreateDocumentTextResult>;
public record CreateDocumentTextResult(Guid Id);

