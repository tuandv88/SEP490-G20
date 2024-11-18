using AI.Application.Models.Documents.Commands.CreateDocumentWeb;

namespace AI.API.Enpoints.Documents;
public record CreateDocumentWebRequest(List<string> Urls);
public record CreateDocumentWebResponse(List<Guid> DocumentIds);
public class CreateDocumentWebEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        app.MapPost("/documents/imports/webs", async (CreateDocumentWebRequest request, ISender sender) => {
            var command = request.Adapt<CreateDocumentWebCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateDocumentWebResponse>();

            return Results.Created($"/documents/{string.Join(",", response.DocumentIds)}", response);
        })
        .WithName("CreateDocumentWeb")
        .Produces<CreateDocumentWebResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Import document web for AI");
    }
}


