using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id)
                .HasConversion(
                    commentId => commentId.Value,              // Chuyển CommentId thành Guid
                    dbId => CommentId.Of(dbId));               // Chuyển Guid thành CommentId

            // Ánh xạ UserId với Value Converter
            builder.Property(c => c.UserId)
                .HasConversion(
                    userId => userId.Value,                    // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))          // Chuyển Guid thành UserId
                .IsRequired();

            // Ánh xạ DiscussionId với Value Converter
            builder.Property(c => c.DiscussionId)
                .HasConversion(
                    discussionId => discussionId.Value,        // Chuyển DiscussionId thành Guid
                    dbDiscussionId => new DiscussionId(dbDiscussionId)) // Chuyển Guid thành DiscussionId
                .IsRequired();

            // Thiết lập mối quan hệ với Votes
            builder.HasMany(c => c.Votes)
                .WithOne(v => v.Comment)
                .HasForeignKey(v => v.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ánh xạ ParentCommentId với Value Converter (nullable)
            builder.Property(c => c.ParentCommentId)
                .HasConversion(
                    parentCommentId => parentCommentId != null ? parentCommentId.Value : (Guid?)null, // Chuyển ParentCommentId thành Guid hoặc null
                    dbParentId => dbParentId.HasValue ? new CommentId(dbParentId.Value) : null);

            // Cấu hình các thuộc tính còn lại
            builder.Property(c => c.Content)
                .IsRequired()
                .HasMaxLength(500);                           // Giới hạn độ dài nội dung bình luận

            builder.Property(c => c.DateCreated)
                .IsRequired();

            builder.Property(c => c.IsEdited)
                .HasDefaultValue(false);                      // Đánh dấu chỉnh sửa, mặc định là false

            builder.Property(c => c.Depth)
                .IsRequired()
                .HasDefaultValue(0);                          // Độ sâu mặc định là 0

            // Thiết lập các chỉ mục để tối ưu hóa hiệu năng truy vấn
            builder.HasIndex(c => c.UserId);
            builder.HasIndex(c => c.DiscussionId);
            builder.HasIndex(c => c.ParentCommentId);
            builder.HasIndex(c => c.Depth);
        }
    }
}
