using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class UserDiscussionConfiguration : IEntityTypeConfiguration<UserDiscussion>
    {
        public void Configure(EntityTypeBuilder<UserDiscussion> builder)
        {
            // Định nghĩa khóa chính cho UserDiscussion
            builder.HasKey(ud => ud.Id);
            builder.Property(ud => ud.Id)
                .HasConversion(
                    userDiscussionId => userDiscussionId.Value,       // Chuyển UserDiscussionId thành Guid
                    dbId => UserDiscussionId.Of(dbId));               // Chuyển Guid thành UserDiscussionId

            // Ánh xạ UserId với Value Converter
            builder.Property(ud => ud.UserId)
                .HasConversion(
                    userId => userId.Value,                          // Chuyển UserId thành Guid
                    dbUserId => new UserId(dbUserId))                // Chuyển Guid thành UserId
                .IsRequired();

            // Ánh xạ DiscussionId với Value Converter
            builder.Property(ud => ud.DiscussionId)
                .HasConversion(
                    discussionId => discussionId.Value,              // Chuyển DiscussionId thành Guid
                    dbDiscussionId => new DiscussionId(dbDiscussionId)) // Chuyển Guid thành DiscussionId
                .IsRequired();

            // Cấu hình các thuộc tính còn lại
            builder.Property(ud => ud.IsFollowing)
                .HasDefaultValue(false);                             // Trạng thái theo dõi mặc định là false

            builder.Property(ud => ud.DateFollowed)
                .IsRequired(false);                                  // Ngày bắt đầu theo dõi (có thể null)

            builder.Property(ud => ud.LastViewed)
                .IsRequired(false);                                  // Thời gian xem gần nhất (có thể null)

            builder.Property(ud => ud.NotificationsEnabled)
                .HasDefaultValue(false);                             // Trạng thái nhận thông báo mặc định là false

            // Thiết lập các chỉ mục để tối ưu hóa tìm kiếm
            builder.HasIndex(ud => ud.UserId);
            builder.HasIndex(ud => ud.DiscussionId);
            builder.HasIndex(ud => ud.IsFollowing);
            builder.HasIndex(ud => ud.NotificationsEnabled);
        }
    }
}
