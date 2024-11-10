namespace AI.API.Enpoints.Documents;

public record CreateDocumentFileResponse(List<Guid> DocumentIds);
public class CreateDocumentFileEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/documents/imports/files", async (HttpRequest request, ISender sender) => {

            var form = await request.ReadFormAsync();

            var command = new CreateDocumentFileCommand(form.Files);
            var result = await sender.Send(command);
            var response = result.Adapt<CreateDocumentFileResponse>();

            return Results.Created($"/documents/{string.Join(",", response.DocumentIds)}", response);
        })
        .WithName("CreateDocumentFile")
        .Produces<CreateDocumentFileResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Import document file for AI");
    }
}
