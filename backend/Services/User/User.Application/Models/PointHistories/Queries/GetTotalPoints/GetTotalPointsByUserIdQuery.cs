using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;
using System;

namespace User.Application.Models.PointHistories.Queries.GetTotalPoints
{
    [Authorize]
    // Truy vấn lấy tổng số điểm của người dùng
    public record GetTotalPointsByUserIdQuery() : IQuery<long>;
}
