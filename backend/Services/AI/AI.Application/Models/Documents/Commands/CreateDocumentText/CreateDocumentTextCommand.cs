using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Documents.Commands.CreateDocumentText;
[Authorize($"{PoliciesType.Administrator}")]
public record CreateDocumentTextCommand(string Text): ICommand<CreateDocumentTextResult>;
public record CreateDocumentTextResult(Guid Id);

