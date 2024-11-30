using AI.Application.Models.Documents.Dtos;
using BuildingBlocks.Pagination;
using Microsoft.AspNetCore.Authorization;

namespace AI.Application.Models.Documents.Queries.GetDocuments;
[Authorize($"{PoliciesType.Administrator}")]
public record GetDocumentQuery(PaginationRequest PaginationRequest): IQuery<GetDocumentResult>;
public record GetDocumentResult(PaginatedResult<DocumentDto> Documents);

