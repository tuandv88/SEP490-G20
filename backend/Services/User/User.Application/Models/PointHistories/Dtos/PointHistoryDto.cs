using System;

namespace User.Application.Models.PointHistories.Dtos
{
    public record PointHistoryDto(
        Guid Id,
        Guid UserId,
        long Point,
        string ChangeType,
        string Source,
        DateTime DateReceived,
        DateTime LastUpdated
    );
}
