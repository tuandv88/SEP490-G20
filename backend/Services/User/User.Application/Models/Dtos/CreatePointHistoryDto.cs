using User.Domain.Enums;

namespace User.Application.Models.Dtos;

public record CreatePointHistoryDto(
    long Points, // Số điểm được thay đổi
    ChangeType ChangeType, // Loại thay đổi (thêm, trừ điểm)
    string Source // Nguồn của điểm
);
