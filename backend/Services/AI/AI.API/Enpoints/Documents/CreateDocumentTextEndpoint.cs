using AI.Application.Models.Documents.Commands.CreateDocumentText;

namespace AI.API.Enpoints.Documents;

public record CreateDocumentTextRequest(string Text);
public record CreateDocumentTextResponse(Guid Id);
public class CreateDocumentTextEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/documents/imports/text", async (CreateDocumentTextRequest request, ISender sender) => {
            var command = request.Adapt<CreateDocumentTextCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateDocumentTextResponse>();

            return Results.Created($"/documents/{response.Id}", response);
        })
        .WithName("CreateDocumentText")
        .Produces<CreateDocumentTextResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Import document text for AI");
    }
}
