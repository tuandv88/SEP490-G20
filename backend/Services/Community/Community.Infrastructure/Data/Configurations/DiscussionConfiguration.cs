namespace Community.Infrastructure.Data.Configurations
{
    public class DiscussionConfiguration : IEntityTypeConfiguration<Discussion>
    {
        public void Configure(EntityTypeBuilder<Discussion> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Id).HasConversion(
                            discussionId => discussionId.Value,
                            dbId => DiscussionId.Of(dbId));

            // Thiết lập quan hệ với Comments, Bookmarks, và UserDiscussions
            builder.HasMany(d => d.Comments)
                .WithOne()
                .HasForeignKey("DiscussionId");

            builder.HasMany(d => d.Bookmarks)
                .WithOne()
                .HasForeignKey("DiscussionId");

            builder.HasMany(d => d.UserDiscussions)
                .WithOne()
                .HasForeignKey("DiscussionId");

            // Thiết lập các thuộc tính của Discussion
            builder.Property(d => d.UserId).IsRequired();
            builder.Property(d => d.CategoryId).IsRequired();
            builder.Property(d => d.Title).IsRequired().HasMaxLength(150);
            builder.Property(d => d.Description).HasMaxLength(int.MaxValue);
            builder.Property(d => d.ViewCount).HasDefaultValue(0);
            builder.Property(d => d.IsActive).HasDefaultValue(true);
            builder.Property(d => d.Tags)
                .HasConversion(
                    tags => string.Join(",", tags),                                              // Chuyển danh sách thành chuỗi
                    tags => tags.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList());    // Chuyển chuỗi thành danh sách

            builder.Property(d => d.DateCreated).IsRequired();
            builder.Property(d => d.DateUpdated).IsRequired();
            builder.Property(d => d.Closed).HasDefaultValue(false);
            builder.Property(d => d.Pinned).HasDefaultValue(false);

            // Tùy chọn thiết lập các chỉ mục để cải thiện hiệu năng tìm kiếm
            builder.HasIndex(d => d.UserId);
            builder.HasIndex(d => d.CategoryId);
            builder.HasIndex(d => d.Title);
            builder.HasIndex(d => d.IsActive);
        }
    }
}
