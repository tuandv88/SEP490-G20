
using AI.Application.Models.Documents.Commands.DeleteDocuments;

namespace AI.API.Enpoints.Documents;

public class DeleteDocumentsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapDelete("/documents", async (string documentIds, ISender sender) => {

            var documentIdArray = documentIds.Split(',');
            await sender.Send(new DeleteDocumentsCommand(documentIdArray));

            return Results.NoContent();
        })
       .WithName("DeleteDocuments")
       .Produces(StatusCodes.Status204NoContent)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Delete documents");
    }
}
