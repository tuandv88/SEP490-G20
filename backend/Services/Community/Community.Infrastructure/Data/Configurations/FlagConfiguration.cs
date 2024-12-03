using Community.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Infrastructure.Data.Configurations;

public class FlagConfiguration : IEntityTypeConfiguration<Flag>
{
    public void Configure(EntityTypeBuilder<Flag> builder)
    {
        // Định nghĩa khóa chính
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id)
            .HasConversion(
                flagId => flagId.Value,             // Chuyển FlagId thành Guid
                dbId => FlagId.Of(dbId));           // Chuyển Guid thành FlagId

        // Đảm bảo DiscussionId là bắt buộc (không cho phép null)
        builder.Property(f => f.DiscussionId)
            .IsRequired(); // Cấu hình DiscussionId là bắt buộc, không cho phép null

        // Cấu hình mối quan hệ 1-1
        builder.HasOne<Discussion>()
            .WithOne()
            .HasForeignKey<Flag>(f => f.DiscussionId) // Liên kết với khóa ngoại của Discussion
            .OnDelete(DeleteBehavior.Cascade);

        // Thiết lập các thuộc tính của Flag
        builder.Property(f => f.ViolationLevel)
            .IsRequired()                           // Mức độ vi phạm bắt buộc phải có
            .HasConversion(
                v => v.ToString(),                  // Chuyển ViolationLevel thành chuỗi
                v => Enum.Parse<ViolationLevel>(v)); // Chuyển chuỗi thành ViolationLevel

        builder.Property(f => f.Reason)
             .IsRequired(false);                    // Giới hạn độ dài cho lý do

        builder.Property(f => f.FlaggedDate)
            .IsRequired();                         // Ngày bị báo cáo phải có giá trị

        // Tạo chỉ mục cho DiscussionId để tối ưu hóa tìm kiếm
        builder.HasIndex(f => f.DiscussionId);
    }
}

