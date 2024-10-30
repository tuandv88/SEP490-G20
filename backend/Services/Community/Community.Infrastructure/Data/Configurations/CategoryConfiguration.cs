namespace Community.Infrastructure.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasConversion(
                            categoryId => categoryId.Value,
                            dbId => CategoryId.Of(dbId));

            // Thiết lập quan hệ với Discussions
            builder.HasMany(c => c.Discussions)
                .WithOne()
                .HasForeignKey("CategoryId");

            // Cấu hình các thuộc tính của Category
            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.Property(c => c.Description).HasMaxLength(500);
            builder.Property(c => c.IsActive).HasDefaultValue(true);

            // Thiết lập chỉ mục
            builder.HasIndex(c => c.Name).IsUnique();
            builder.HasIndex(c => c.IsActive);
        }
    }
}
