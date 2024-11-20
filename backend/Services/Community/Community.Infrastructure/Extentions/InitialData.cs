using System;
using System.Collections.Generic;
using Community.Domain.Enums;
using Community.Domain.ValueObjects;

namespace Community.Infrastructure.Extensions
{
    public static class InitialData
    {
        // Danh sách User mẫu
        public static readonly List<User> Users = new List<User>
        {
            new User(new Guid("c3d4e5f6-a7b8-9012-3456-789abcdef010"), "John Doe"),
            new User(new Guid("b2c3d4e5-f6a7-8901-2345-6789abcdef01"), "Jane Smith"),
            new User(new Guid("c3d4e5f6-a7b8-9012-3456-789abcdef012"), "Michael Brown"),
            new User(new Guid("d4e5f6a7-b8c9-0123-4567-89abcdef0123"), "Emily Johnson"),
            new User(new Guid("e5f6a7b8-c9d0-1234-5678-9abcdef01234"), "Chris Lee")
        };

        // Danh sách Category mẫu với các GUID cố định
        public static readonly List<Category> Categories = new List<Category>
        {
            new Category { Id = new CategoryId(new Guid("11111111-1111-1111-1111-111111111111")), Name = "Technology", Description = "Discussions about technology", IsActive = true },
            new Category { Id = new CategoryId(new Guid("22222222-2222-2222-2222-222222222222")), Name = "Career", Description = "Career advice and guidance", IsActive = true },
            new Category { Id = new CategoryId(new Guid("33333333-3333-3333-3333-333333333333")), Name = "Health", Description = "Health and wellness topics", IsActive = true },
            new Category { Id = new CategoryId(new Guid("44444444-4444-4444-4444-444444444444")), Name = "Education", Description = "Educational discussions", IsActive = true },
            new Category { Id = new CategoryId(new Guid("55555555-5555-5555-5555-555555555555")), Name = "Finance", Description = "Financial advice and news", IsActive = false }
        };

        // Danh sách Discussion mẫu
        public static readonly List<Discussion> Discussions = new List<Discussion>
        {
            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[0].Id, CategoryId = Categories[0].Id,
                Title = "Future of AI", Description = "The impact of AI on society", ViewCount = 100, IsActive = true,
                Tags = new List<string> { "AI", "Technology" }, DateCreated = DateTime.UtcNow.AddDays(-10), DateUpdated = DateTime.UtcNow,
                Closed = false, Pinned = true, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[1].Id, CategoryId = Categories[1].Id,
                Title = "Career Growth Tips", Description = "How to grow in your career", ViewCount = 80, IsActive = true,
                Tags = new List<string> { "Career", "Growth" }, DateCreated = DateTime.UtcNow.AddDays(-20), DateUpdated = DateTime.UtcNow,
                Closed = false, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[2].Id, CategoryId = Categories[2].Id,
                Title = "Health Benefits of Yoga", Description = "Discussing yoga for health", ViewCount = 50, IsActive = true,
                Tags = new List<string> { "Health", "Yoga" }, DateCreated = DateTime.UtcNow.AddDays(-15), DateUpdated = DateTime.UtcNow,
                Closed = false, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[3].Id, CategoryId = Categories[3].Id,
                Title = "Best Learning Techniques", Description = "Effective learning techniques", ViewCount = 60, IsActive = true,
                Tags = new List<string> { "Education", "Learning" }, DateCreated = DateTime.UtcNow.AddDays(-5), DateUpdated = DateTime.UtcNow,
                Closed = false, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[4].Id, CategoryId = Categories[4].Id,
                Title = "Saving for Retirement", Description = "Financial planning for retirement", ViewCount = 30, IsActive = false,
                Tags = new List<string> { "Finance", "Retirement" }, DateCreated = DateTime.UtcNow.AddDays(-2), DateUpdated = DateTime.UtcNow,
                Closed = true, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[0].Id, CategoryId = Categories[0].Id,
                Title = "Saving for Retirement 02", Description = "Financial planning for retirement 02", ViewCount = 30, IsActive = false,
                Tags = new List<string> { "Hanna", "Yakata" }, DateCreated = DateTime.UtcNow.AddDays(-2), DateUpdated = DateTime.UtcNow,
                Closed = true, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[0].Id, CategoryId = Categories[0].Id,
                Title = "Saving for Retirement 03 ", Description = "Financial planning for retirement 03", ViewCount = 30, IsActive = true,
                Tags = new List<string> { "AI", "Banana" }, DateCreated = DateTime.UtcNow.AddDays(-2), DateUpdated = DateTime.UtcNow,
                Closed = true, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = true},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[0].Id, CategoryId = Categories[0].Id,
                Title = "Saving for Retirement 02", Description = "Financial planning for retirement 02", ViewCount = 30, IsActive = true,
                Tags = new List<string> { "Tanakhan", "Yakata" }, DateCreated = DateTime.UtcNow.AddDays(-2), DateUpdated = DateTime.UtcNow,
                Closed = true, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = false},

            new Discussion { Id = new DiscussionId(Guid.NewGuid()), UserId = Users[0].Id, CategoryId = Categories[0].Id,
                Title = "Saving for Retirement 03 ", Description = "Financial planning for retirement 03", ViewCount = 30, IsActive = true,
                Tags = new List<string> { "Kita", "Banana" }, DateCreated = DateTime.UtcNow.AddDays(-2), DateUpdated = DateTime.UtcNow,
                Closed = true, Pinned = false, ImageUrl = "backend/imagediscussions/1748b3c7a1f469cb245df8613671fe70.jpg" , NotificationsEnabled = false}
        };

        // Danh sách Comment mẫu
        public static readonly List<Comment> Comments = new List<Comment>
        {
            new Comment { Id = new CommentId(Guid.NewGuid()), DiscussionId = Discussions[0].Id, UserId = Users[1].Id,
                Content = "AI will change our lives drastically", DateCreated = DateTime.UtcNow.AddDays(-9), IsEdited = false, Depth = 0, IsActive = true  },
            new Comment { Id = new CommentId(Guid.NewGuid()), DiscussionId = Discussions[1].Id, UserId = Users[2].Id,
                Content = "Focus on skills and networking", DateCreated = DateTime.UtcNow.AddDays(-19), IsEdited = false, Depth = 0 , IsActive = true },
            new Comment { Id = new CommentId(Guid.NewGuid()), DiscussionId = Discussions[2].Id, UserId = Users[3].Id,
                Content = "Yoga is great for stress management", DateCreated = DateTime.UtcNow.AddDays(-14), IsEdited = true, Depth = 0 , IsActive = true },
            new Comment { Id = new CommentId(Guid.NewGuid()), DiscussionId = Discussions[3].Id, UserId = Users[4].Id,
                Content = "Consistent practice is key to learning", DateCreated = DateTime.UtcNow.AddDays(-4), IsEdited = false, Depth = 1 , IsActive = true },
            new Comment { Id = new CommentId(Guid.NewGuid()), DiscussionId = Discussions[4].Id, UserId = Users[0].Id,
                Content = "Saving early is beneficial", DateCreated = DateTime.UtcNow.AddDays(-1), IsEdited = false, Depth = 0 , IsActive = true }
        };

        // Danh sách Vote mẫu
        public static readonly List<Vote> Votes = new List<Vote>
        {
            new Vote { Id = new VoteId(Guid.NewGuid()), DiscussionId = Discussions[0].Id, UserId = Users[2].Id, VoteType = VoteType.Like, DateVoted = DateTime.UtcNow,  IsActive = true  },
            new Vote { Id = new VoteId(Guid.NewGuid()), DiscussionId = Discussions[1].Id, UserId = Users[3].Id, VoteType = VoteType.Dislike, DateVoted = DateTime.UtcNow , IsActive = true },
            new Vote { Id = new VoteId(Guid.NewGuid()), CommentId = Comments[0].Id, UserId = Users[0].Id, VoteType = VoteType.Like, DateVoted = DateTime.UtcNow , IsActive = true },
            new Vote { Id = new VoteId(Guid.NewGuid()), CommentId = Comments[1].Id, UserId = Users[1].Id, VoteType = VoteType.Like, DateVoted = DateTime.UtcNow },
            new Vote { Id = new VoteId(Guid.NewGuid()), CommentId = Comments[2].Id, UserId = Users[4].Id, VoteType = VoteType.Dislike, DateVoted = DateTime.UtcNow , IsActive = true }
        };

        // Danh sách Bookmark mẫu
        public static readonly List<Bookmark> Bookmarks = new List<Bookmark>
        {
            new Bookmark { Id = new BookmarkId(Guid.NewGuid()), UserId = Users[1].Id, DiscussionId = Discussions[2].Id, DateBookmarked = DateTime.UtcNow },
            new Bookmark { Id = new BookmarkId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[1].Id, DateBookmarked = DateTime.UtcNow },
            new Bookmark { Id = new BookmarkId(Guid.NewGuid()), UserId = Users[3].Id, DiscussionId = Discussions[4].Id, DateBookmarked = DateTime.UtcNow },
            new Bookmark { Id = new BookmarkId(Guid.NewGuid()), UserId = Users[2].Id, DiscussionId = Discussions[0].Id, DateBookmarked = DateTime.UtcNow },
            new Bookmark { Id = new BookmarkId(Guid.NewGuid()), UserId = Users[4].Id, DiscussionId = Discussions[3].Id, DateBookmarked = DateTime.UtcNow }
        };

        // Danh sách UserDiscussion mẫu
        public static readonly List<UserDiscussion> UserDiscussions = new List<UserDiscussion>
        {
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[0].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = true },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[1].Id, DiscussionId = Discussions[1].Id,
                IsFollowing = false, DateFollowed = null, LastViewed = DateTime.UtcNow, NotificationsEnabled = true },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[2].Id, DiscussionId = Discussions[2].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[3].Id, DiscussionId = Discussions[3].Id,
                IsFollowing = false, DateFollowed = null, LastViewed = DateTime.UtcNow, NotificationsEnabled = true },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[4].Id, DiscussionId = Discussions[4].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[5].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[6].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[7].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false },
            new UserDiscussion { Id = new UserDiscussionId(Guid.NewGuid()), UserId = Users[0].Id, DiscussionId = Discussions[8].Id,
                IsFollowing = true, DateFollowed = DateTime.UtcNow, LastViewed = DateTime.UtcNow, NotificationsEnabled = false }
        };

        // Danh sách NotificationType mẫu
        public static readonly List<NotificationType> NotificationTypes = new List<NotificationType>
        {
            new NotificationType { Id = new NotificationTypeId(Guid.NewGuid()), Name = "New Comment", Description = "Notify when a new comment is added",
                CanSendEmail = true, CanSendWebsite = true, Priority = 3 },
            new NotificationType { Id = new NotificationTypeId(Guid.NewGuid()), Name = "New Vote", Description = "Notify when a new vote is received",
                CanSendEmail = false, CanSendWebsite = true, Priority = 2 }
        };

        // Danh sách UserNotificationSetting mẫu
        public static readonly List<UserNotificationSetting> UserNotificationSettings = new List<UserNotificationSetting>
        {
            new UserNotificationSetting { Id = new UserNotificationSettingId(Guid.NewGuid()), UserId = Users[0].Id, NotificationTypeId = NotificationTypes[0].Id,
                IsNotificationEnabled = true, IsEmailEnabled = true, IsWebsiteEnabled = true, NotificationFrequency = NotificationFrequency.Immediate },
            new UserNotificationSetting { Id = new UserNotificationSettingId(Guid.NewGuid()), UserId = Users[1].Id, NotificationTypeId = NotificationTypes[1].Id,
                IsNotificationEnabled = true, IsEmailEnabled = false, IsWebsiteEnabled = true, NotificationFrequency = NotificationFrequency.Daily }
        };

        // Danh sách NotificationHistory mẫu
        public static readonly List<NotificationHistory> NotificationHistories = new List<NotificationHistory>
        {
            new NotificationHistory { Id = new NotificationHistoryId(Guid.NewGuid()), UserId = Users[0].Id, NotificationTypeId = NotificationTypes[0].Id,
                Message = "New comment on your post", DateSent = DateTime.UtcNow, DateRead = null, IsRead = false, SentVia = SentVia.Web, Status = Status.Sent },
            new NotificationHistory { Id = new NotificationHistoryId(Guid.NewGuid()), UserId = Users[1].Id, NotificationTypeId = NotificationTypes[1].Id,
                Message = "Your post received a new vote", DateSent = DateTime.UtcNow, DateRead = DateTime.UtcNow, IsRead = true, SentVia = SentVia.Web, Status = Status.Received }
        };
    }

    public class User
    {
        public UserId Id { get; }
        public string Name { get; }

        public User(Guid id, string name)
        {
            Id = UserId.Of(id);
            Name = name;
        }
    }
}
