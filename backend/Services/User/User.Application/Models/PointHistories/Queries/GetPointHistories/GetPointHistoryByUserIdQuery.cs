using System;
using BuildingBlocks.CQRS;
using User.Application.Models.PointHistories.Dtos;

namespace User.Application.Models.PointHistories.Queries.GetPointHistories
{
    public record GetPointHistoryByUserIdQuery(Guid UserId) : IQuery<GetPointHistoryByUserIdResult>;
    public record GetPointHistoryByUserIdResult(List<PointHistoryDto> PointHistories);
}
