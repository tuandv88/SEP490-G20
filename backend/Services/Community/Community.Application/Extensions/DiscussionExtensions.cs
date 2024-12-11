using Community.Application.Models.Discussions.Dtos;
using Community.Domain.Models;

namespace Community.Application.Extensions;

public static class DiscussionExtensions
{
    public static async Task<List<DiscussionDto>> ToDiscussionDtoListAsync(this List<Discussion> discussions, IFilesService filesService)
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

            // Chuyển đổi đối tượng Discussion thành DiscussionDto với imageUrl (có thể null)
            return d.ToDiscussionDto(imageUrl);
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
            VoteCount: (long)VoteExtensions.CalculateTotalVotes(discussion),
            CommentCount: discussion.Comments.Count,
            Pinned: discussion.Pinned,
            Closed: discussion.Closed,
            EnableNotification: discussion.NotificationsEnabled,
            IsActive: discussion.IsActive
        );
    }

    public static async Task<DiscussionDetailDto> ToDiscussionDetailDtoAsync(this Discussion discussion, IFilesService filesService)
    {
        string? imageUrl = null;

        // Kiểm tra nếu d.ImageUrl không phải null hoặc rỗng
        if (!string.IsNullOrEmpty(discussion.ImageUrl))
        {
            // Nếu có ImageUrl, gọi GetFileAsync để lấy URL ảnh
            var fileInfo = await filesService.GetFileAsync(StorageConstants.BUCKET, discussion.ImageUrl, 60);
            imageUrl = fileInfo.PresignedUrl;  // Lưu URL ảnh vào biến imageUrl
        }

        return new DiscussionDetailDto(
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

    public static async Task<List<DiscussionDetailUserDto>> ToDiscussionDetailUserDtoListAsync(this List<Discussion> discussions,
    ICategoryRepository categoryRepository,
    IFlagRepository flagRepository)
    {
        var discussionDetailUserDtos = new List<DiscussionDetailUserDto>();

        foreach (var discussion in discussions)
        {
            // Lấy thông tin danh mục của thảo luận
            var category = await categoryRepository.GetByIdAsync(discussion.CategoryId.Value);
            string categoryName = category?.Name ?? "Unknown";  // Tên danh mục hoặc mặc định "Unknown"

            // Kiểm tra xem thảo luận có Flag không
            Flag flag = null;
            if (discussion?.FlagId?.Value != null)
            {
                flag = await flagRepository.GetByIdAsync(discussion.FlagId.Value);
            }

            // Nếu có Flag, lấy thông tin từ Flag, nếu không thì sử dụng giá trị mặc định
            Guid flagId = flag?.Id.Value ?? Guid.Empty;  // Sử dụng Guid.Empty nếu flag là null
            DateTime? flaggedDate = flag?.FlaggedDate;
            ViolationLevel violationLevel = flag?.ViolationLevel ?? ViolationLevel.None;
            string reason = flag?.Reason ?? string.Empty;

            // Chuyển đổi thảo luận thành DiscussionDetailUserDto
            var dto = new DiscussionDetailUserDto(
                CategoryId: discussion.CategoryId.Value,
                NameCategory: categoryName,
                DiscussionId: discussion.Id.Value,
                Title: discussion.Title,
                Description: discussion.Description,
                DateCreated: discussion.DateCreated,
                ViewCount: (long)discussion.ViewCount,
                VoteCount: (long)VoteExtensions.CalculateTotalVotes(discussion),
                CommentsCount: discussion.Comments.Count,
                IsActive: discussion.IsActive,
                Tags: discussion.Tags,
                NotificationsEnabled: discussion.NotificationsEnabled,
                FlagId: flagId,
                FlaggedDate: flaggedDate ?? DateTime.MinValue, 
                ViolationLevel: violationLevel,
                Reason: reason
            );

            discussionDetailUserDtos.Add(dto);
        }

        return discussionDetailUserDtos;
    }


    public static async Task<DiscussionDetailsDto> ToDiscussionDetailsDtoAsync(this Discussion discussion, IFilesService filesService)
    {
        string? imageUrl = null;

        if (!string.IsNullOrEmpty(discussion.ImageUrl))
        {
            var fileInfo = await filesService.GetFileAsync(StorageConstants.BUCKET, discussion.ImageUrl, 60);
            imageUrl = fileInfo.PresignedUrl;  
        }

        return new DiscussionDetailsDto(
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
            VoteCount: (long)VoteExtensions.CalculateTotalVotes(discussion),
            CommentCount: (long)discussion.Comments.Count,
            Pinned: discussion.Pinned,
            Closed: discussion.Closed,
            EnableNotification: discussion.NotificationsEnabled,
            IsActive: discussion.IsActive
        );
    }


}