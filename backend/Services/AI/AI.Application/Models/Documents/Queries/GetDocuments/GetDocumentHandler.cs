using AI.Application.Extensions;
using AI.Application.Models.Documents.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Documents.Queries.GetDocuments;
public class GetDocumentHandler(IDocumentRepository repository, IDocumentService documentService) : IQueryHandler<GetDocumentQuery, GetDocumentResult> {
    public async Task<GetDocumentResult> Handle(GetDocumentQuery query, CancellationToken cancellationToken) {
        var allData = await repository.GetAllAsync();
        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();
        var documents = allData.OrderBy(c => c.CreatedAt)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();

        var documentDtos = documents.Select( d => d.ToDocumentDto(documentService.GetDocumentLink(d).Result)).ToList();
        return new GetDocumentResult(
            new PaginatedResult<DocumentDto>(pageIndex, pageSize, totalCount, documentDtos));
    }
}

