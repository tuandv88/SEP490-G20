namespace Community.Domain.Models
{
    public class Discussion : Aggregate<DiscussionId>
    {
        public List<Comment> Comments = new();
        public List<Bookmark> Bookmarks = new();
        public List<UserDiscussion> UserDiscussions = new(); 
        public List<Vote> Votes { get; set; } = new();
        public UserId UserId { get; set; } = default!;           // ID của người tạo thảo luận
        public CategoryId CategoryId { get; set; } = default!;   // ID chuyên mục chứa thảo luận
        public string Title { get; set; } = default!;            // Tiêu đề thảo luận
        public string Description { get; set; } = default!;      // Mô tả nội dung thảo luận
        public string? ImageUrl { get; set; } = default!;        // URL của ảnh thảo luận
        public long ViewCount { get; set; }                      // Số lượt xem
        public bool IsActive { get; set; }                       // Trạng thái hoạt động
        public List<string> Tags { get; set; } = new();          // Tag của thảo luận (dạng JSON)
        public DateTime DateCreated { get; set; }                // Thời gian tạo
        public DateTime DateUpdated { get; set; }                // Thời gian cập nhật gần nhất
        public bool Closed { get; set; }                         // Đánh dấu nếu thảo luận đã đóng
        public bool Pinned { get; set; }                         // Đánh dấu nếu thảo luận được ghim

        // Phương thức tạo mới một Discussion
        public static Discussion Create(DiscussionId discussionId, UserId userId, CategoryId categoryId, string title, string description, bool isActive, List<string> tags, string? imageUrl = null)
        {
            var discussion = new Discussion
            {
                Id = discussionId,
                UserId = userId,
                CategoryId = categoryId,
                Title = title,
                Description = description,
                ImageUrl = imageUrl,
                IsActive = isActive,
                Tags = tags,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now,
                ViewCount = 0,
                Closed = false,
                Pinned = false
            };

            discussion.AddDomainEvent(new DiscussionCreatedEvent(discussion));
            return discussion;
        }

        // Phương thức cập nhật thông tin của Discussion
        public void Update(UserId userId, CategoryId categoryId, string title, string description, bool isActive, List<string> tags, bool closed, bool pinned, long viewCount)
        {
            UserId = userId;
            CategoryId = categoryId;
            Title = title;
            Description = description;
            Tags = tags;
            IsActive = isActive;
            Closed = closed;
            Pinned = pinned;
            ViewCount = viewCount;
            DateUpdated = DateTime.Now;

            // Thêm sự kiện cập nhật nếu cần thiết
            // AddDomainEvent(new DiscussionUpdatedEvent(this));
        }

        // Tăng số lượt xem
        public void IncrementViewCount()
        {
            ViewCount++;
        }

        // Đóng hoặc mở thảo luận
        public void ToggleClosed()
        {
            Closed = !Closed;
            DateUpdated = DateTime.Now;
        }

        // Ghim hoặc bỏ ghim thảo luận
        public void TogglePinned()
        {
            Pinned = !Pinned;
            DateUpdated = DateTime.Now;
        }
    }
}
