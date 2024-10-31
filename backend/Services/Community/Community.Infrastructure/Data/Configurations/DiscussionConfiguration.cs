using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class DiscussionConfiguration : IEntityTypeConfiguration<Discussion>
    {
        public void Configure(EntityTypeBuilder<Discussion> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Id).HasConversion(
                discussionId => discussionId.Value,         // Chuyển DiscussionId thành Guid
                dbId => DiscussionId.Of(dbId));            // Chuyển Guid thành DiscussionId

            // Thiết lập quan hệ với Comments, Bookmarks, và UserDiscussions
            builder.HasMany(d => d.Comments)
                .WithOne()
                .HasForeignKey("DiscussionId")
                .OnDelete(DeleteBehavior.Cascade);         // Xóa các Comment khi Discussion bị xóa

            builder.HasMany(d => d.Bookmarks)
                .WithOne()
                .HasForeignKey("DiscussionId")
                .OnDelete(DeleteBehavior.Cascade);         // Xóa các Bookmark khi Discussion bị xóa

            builder.HasMany(d => d.UserDiscussions)
                .WithOne()
                .HasForeignKey("DiscussionId")
                .OnDelete(DeleteBehavior.Cascade);         // Xóa các UserDiscussion khi Discussion bị xóa

            // Thiết lập mối quan hệ với Votes
            builder.HasMany(d => d.Votes)
                .WithOne(v => v.Discussion)
                .HasForeignKey(v => v.DiscussionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Thiết lập các thuộc tính của Discussion
            builder.Property(d => d.UserId)
                .HasConversion(
                    userId => userId.Value,                // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))      // Chuyển Guid thành UserId
                .IsRequired();

            builder.Property(d => d.CategoryId)
                .HasConversion(
                    categoryId => categoryId.Value,        // Chuyển CategoryId thành Guid
                    dbCategoryId => new CategoryId(dbCategoryId)) // Chuyển Guid thành CategoryId
                .IsRequired();

            builder.Property(d => d.Title)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(d => d.Description)
                .HasMaxLength(int.MaxValue);

            // Cấu hình thuộc tính ImageUrl
            builder.Property(d => d.ImageUrl)
                .HasMaxLength(500)                        // Đặt giới hạn độ dài cho URL
                .IsRequired(false);                       // Cho phép giá trị null nếu không có ảnh

            builder.Property(d => d.ViewCount)
                .HasDefaultValue(0);

            builder.Property(d => d.IsActive)
                .HasDefaultValue(true);

            // Chuyển đổi danh sách Tags thành chuỗi và ngược lại
            builder.Property(d => d.Tags)
                .HasConversion(
                    tags => string.Join(",", tags),                           // Chuyển danh sách thành chuỗi
                    tags => tags.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()) // Chuyển chuỗi thành danh sách
                .HasMaxLength(int.MaxValue);

            builder.Property(d => d.DateCreated)
                .IsRequired();

            builder.Property(d => d.DateUpdated)
                .IsRequired();

            builder.Property(d => d.Closed)
                .HasDefaultValue(false);

            builder.Property(d => d.Pinned)
                .HasDefaultValue(false);

            // Tùy chọn thiết lập các chỉ mục để cải thiện hiệu năng tìm kiếm
            builder.HasIndex(d => d.UserId);
            builder.HasIndex(d => d.CategoryId);
            builder.HasIndex(d => d.Title);
            builder.HasIndex(d => d.IsActive);
        }
    }
}
