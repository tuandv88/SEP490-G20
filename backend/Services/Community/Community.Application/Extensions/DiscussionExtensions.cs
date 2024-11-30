using Community.Application.Models.Discussions.Dtos;
using Community.Domain.Models;

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
            VoteCount: (long) VoteExtensions.CalculateTotalVotes(discussion),
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
            VoteCount: (long)VoteExtensions.CalculateTotalVotes(discussion),
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

    public static async Task<List<DiscussionsTopDto>> ToDiscussionsTopDtoListAsync(
this List<Discussion> discussions,
IFilesService filesService) // Thêm CategoryRepository để truy vấn Category
    {
        var tasks = discussions.Select(async d =>
        {
            string? imageUrl = null;

            // Kiểm tra nếu d.ImageUrl không phải null hoặc rỗng
            if (!string.IsNullOrEmpty(d.ImageUrl))
            {
                // Nếu có ImageUrl, gọi GetFileAsync để lấy URL ảnh
                var fileInfo = await filesService.GetFileAsync(StorageConstants.BUCKET, d.ImageUrl, 60);
                imageUrl = fileInfo.PresignedUrl;  // Lưu URL ảnh vào biến imageUrl
            }

            // Cắt Description nếu nó dài hơn 50 ký tự
            var shortDescription = d.Description.Length > 50 ? d.Description.Substring(0, 50) + "...." : d.Description;

            return new DiscussionsTopDto(
                CategoryId: d.CategoryId.Value,
                UserId: d.UserId.Value,
                Id: d.Id.Value,
                Title: d.Title,
                Description: shortDescription,  // Gán description đã được cắt
                ImageUrl: imageUrl,
                DateCreated: d.DateCreated,
                DateUpdated: d.DateUpdated,
                Tags: d.Tags,
                Pinned: d.Pinned,
                ViewCount: (long)d.ViewCount,
                VoteCount: (long)VoteExtensions.CalculateTotalVotes(d),
                CommentCount: (long)d.Comments.Count,
                Closed: d.Closed,
                EnableNotification: d.NotificationsEnabled,
                IsActive: d.IsActive
            );
        });

        var discussionDtos = await Task.WhenAll(tasks);
        return discussionDtos.ToList();
    }
}