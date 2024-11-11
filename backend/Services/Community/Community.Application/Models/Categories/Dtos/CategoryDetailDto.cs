using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Categories.Dtos;
public record CategoryDetailDto(
    Guid Id,
    string Name,                       // Tên chuyên mục
    string Description,                // Mô tả chuyên mục
    bool IsActive,                     // Trạng thái hoạt động
    List<DiscussionDetailDto> Discussions // Danh sách các thảo luận trong chuyên mục
);


