using AI.Application.Models.Documents.Dtos;
using BuildingBlocks.Pagination;

namespace AI.Application.Models.Documents.Queries.GetDocuments;
public record GetDocumentQuery(PaginationRequest PaginationRequest): IQuery<GetDocumentResult>;
public record GetDocumentResult(PaginatedResult<DocumentDto> Documents);

