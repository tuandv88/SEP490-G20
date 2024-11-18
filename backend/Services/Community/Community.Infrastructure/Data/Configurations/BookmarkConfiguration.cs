using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class BookmarkConfiguration : IEntityTypeConfiguration<Bookmark>
    {
        public void Configure(EntityTypeBuilder<Bookmark> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasConversion(
                    bookmarkId => bookmarkId.Value,              // Chuyển BookmarkId thành Guid
                    dbId => BookmarkId.Of(dbId));               // Chuyển Guid thành BookmarkId

            // Ánh xạ UserId với Value Converter
            builder.Property(b => b.UserId)
                .HasConversion(
                    userId => userId.Value,                     // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))           // Chuyển Guid thành UserId
                .IsRequired();

            // Ánh xạ DiscussionId với Value Converter
            builder.Property(b => b.DiscussionId)
                .HasConversion(
                    discussionId => discussionId.Value,         // Chuyển DiscussionId thành Guid
                    dbDiscussionId => new DiscussionId(dbDiscussionId)) // Chuyển Guid thành DiscussionId
                .IsRequired();

            // Cấu hình thuộc tính DateBookmarked
            builder.Property(b => b.DateBookmarked)
                .IsRequired();                                 // Ngày lưu bài là bắt buộc

            // Thiết lập các chỉ mục để tối ưu hóa hiệu năng tìm kiếm
            builder.HasIndex(b => b.UserId);
            builder.HasIndex(b => b.DiscussionId);
        }
    }
}
