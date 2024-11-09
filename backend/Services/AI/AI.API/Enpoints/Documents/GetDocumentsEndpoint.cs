using AI.Application.Models.Documents.Queries.GetDocuments;

namespace AI.API.Enpoints.Documents;
public record GetDocumentReponse(PaginatedResult<DocumentDto> Documents);
public class GetDocumentsEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {
        app.MapGet("/documents", async ([AsParameters] PaginationRequest request, ISender sender) => {
            var result = await sender.Send(new GetDocumentQuery(request));

            var response = result.Adapt<GetDocumentReponse>();

            return Results.Ok(response);

        })
       .WithName("GetDocuments")
       .Produces<GetDocumentReponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .ProducesProblem(StatusCodes.Status404NotFound)
       .WithSummary("Get documents");
    }
}

