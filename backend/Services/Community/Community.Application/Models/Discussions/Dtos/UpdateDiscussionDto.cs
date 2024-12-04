namespace Community.Application.Models.Discussions.Dtos;

public record UpdateDiscussionDto(
    Guid Id,
    Guid CategoryId,
    string Title,
    string Description,
    bool IsActive,
    List<string> Tags,
    bool Closed,
    bool Pinned,
    long ViewCount,
    bool EnableNotification,
    ImageDto? ImageDto               // Image 
);
