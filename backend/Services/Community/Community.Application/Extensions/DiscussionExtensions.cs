using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Extensions;

public static class DiscussionExtensions
{
    public static async Task<List<DiscussionDto>> ToDiscussionDtoListAsync(this List<Discussion> discussions, IFilesService filesService)
    {
        var tasks = discussions.Select(async d =>
        {
            var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, d.ImageUrl, 60);
            return d.ToDiscussionDto(imageUrl.PresignedUrl!);
        });

        var discussionDtos = await Task.WhenAll(tasks);
        return discussionDtos.ToList();
    }

    public static DiscussionDto ToDiscussionDto(this Discussion discussion, string imageUrl)
    {
        return new DiscussionDto(
            UserName: "Unknown",                        // Placeholder, có thể thay thế bằng dữ liệu từ bảng Users
            UserAvatarUrl: "default-avatar.png",        // Placeholder, có thể lấy từ bảng Users
            UserId: discussion.UserId.Value,
            CategoryId: discussion.CategoryId.Value,
            Id: discussion.Id.Value,
            Title: discussion.Title,
            Description: discussion.Description,
            ImageUrl: imageUrl,
            DateCreated: discussion.DateCreated,
            DateUpdated: discussion.DateUpdated,
            Tags: discussion.Tags,
            ViewCount: (long)discussion.ViewCount,
            VoteCount: (long)discussion.Votes.Count,
            CommentCount: discussion.Comments.Count,
            Pinned: discussion.Pinned,
            Closed: discussion.Closed,
            EnableNotification: discussion.NotificationsEnabled,
            IsActive: discussion.IsActive
        );
    }

    public static async Task<DiscussionDetailDto> ToDiscussionDetailDtoAsync(this Discussion discussion, IFilesService filesService)
    {
        var imageUrl = await filesService.GetFileAsync(StorageConstants.BUCKET, discussion.ImageUrl, 60);

        return new DiscussionDetailDto(
            UserName: "Unknown",                        // Placeholder, có thể thay thế bằng dữ liệu từ bảng Users
            UserAvatarUrl: "default-avatar.png",        // Placeholder, có thể lấy từ bảng Users
            UserId: discussion.UserId.Value,
            CategoryId: discussion.CategoryId.Value,
            Id: discussion.Id.Value,
            Title: discussion.Title,
            Description: discussion.Description,
            ImageUrl: imageUrl.PresignedUrl!,
            DateCreated: discussion.DateCreated,
            DateUpdated: discussion.DateUpdated,
            Tags: discussion.Tags,
            ViewCount: (long)discussion.ViewCount,
            VoteCount: (long)discussion.Votes.Count,
            CommentCount: (long)discussion.Comments.Count,
            Pinned: discussion.Pinned,
            Closed: discussion.Closed,
            EnableNotification: discussion.NotificationsEnabled,
            IsActive: discussion.IsActive,              // Trạng thái hoạt động của thảo luận
            Comments: discussion.Comments.Select(c => c.ToCommentDetailDto()).ToList(),
            Votes: discussion.Votes.Select(v => v.ToVoteDto()).ToList(),
            Bookmarks: discussion.Bookmarks.Select(b => b.ToBookmarkDto()).ToList(),
            UserDiscussions: discussion.UserDiscussions.Select(ud => ud.ToUserDiscussionDto()).ToList()
        );
    }
}