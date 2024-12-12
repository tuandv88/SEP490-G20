using AI.Application.Extensions;
using AI.Application.Models.Documents.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Documents.Queries.GetDocuments;

public class GetDocumentHandler(IDocumentRepository repository, IDocumentService documentService)
    : IQueryHandler<GetDocumentQuery, GetDocumentResult>
{
    public async Task<GetDocumentResult> Handle(GetDocumentQuery query, CancellationToken cancellationToken)
    {
        var allData = await repository.GetAllAsync();
        //Phân trang
        var pageIndex = query.PaginationRequest.PageIndex;
        var pageSize = query.PaginationRequest.PageSize;

        var totalCount = allData.Count();
        var documents = allData.OrderByDescending(c => c.CreatedAt)
            .Skip(pageSize * (pageIndex - 1))
            .Take(pageSize)
            .ToList();

        var documentDtoTasks = documents.Select(async d =>
        {
            var link = await documentService.GetDocumentLink(d);
            return d.ToDocumentDto(link);
        });
        
        var documentDtos = (await Task.WhenAll(documentDtoTasks)).ToList();
        return new GetDocumentResult(
            new PaginatedResult<DocumentDto>(pageIndex, pageSize, totalCount, documentDtos));
    }
}