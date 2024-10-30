using Community.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Định nghĩa khóa chính cho Category
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id)
                .HasConversion(
                    categoryId => categoryId.Value,    // Chuyển CategoryId thành Guid
                    dbId => CategoryId.Of(dbId));      // Chuyển Guid thành CategoryId

            // Thiết lập quan hệ với Discussions
            builder.HasMany(c => c.Discussions)
                .WithOne()
                .HasForeignKey("CategoryId")           // Khóa ngoại trên bảng Discussions
                .OnDelete(DeleteBehavior.Cascade);      // Xóa các Discussion khi Category bị xóa

            // Cấu hình các thuộc tính của Category
            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Description)
                .HasMaxLength(500);

            builder.Property(c => c.IsActive)
                .HasDefaultValue(true);

            // Thiết lập chỉ mục
            builder.HasIndex(c => c.Name)
                .IsUnique();                           // Đảm bảo tên là duy nhất

            builder.HasIndex(c => c.IsActive);          // Chỉ mục cho IsActive
        }
    }
}
