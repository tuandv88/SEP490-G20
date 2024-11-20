using BuildingBlocks.CQRS;
using System;

namespace User.Application.Models.PointHistories.Queries.GetTotalPoints
{
    // Truy vấn lấy tổng số điểm của người dùng
    public record GetTotalPointsByUserIdQuery(Guid UserId) : IQuery<long>;
}
