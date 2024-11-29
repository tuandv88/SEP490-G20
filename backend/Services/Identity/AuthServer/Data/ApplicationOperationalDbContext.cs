using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AuthServer.Data
{
    public class ApplicationOperationalDbContext : PersistedGrantDbContext<ApplicationOperationalDbContext>
    {
        // Constructor yêu cầu DbContextOptions và OperationalStoreOptions
        public ApplicationOperationalDbContext(
            DbContextOptions<ApplicationOperationalDbContext> options,
            OperationalStoreOptions operationalStoreOptions)
            : base(options, operationalStoreOptions) // Truyền đối số cho base class
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tự động chuyển đổi tất cả DateTime thành UTC
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    // Kiểm tra kiểu dữ liệu là DateTime hoặc DateTime?
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        // Nếu là DateTime
                        if (property.ClrType == typeof(DateTime))
                        {
                            property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                                v => v.ToUniversalTime(), // Khi lưu, chuyển thành UTC
                                v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Khi lấy dữ liệu, đặt DateTimeKind thành UTC
                            ));
                        }
                        // Nếu là DateTime?
                        else if (property.ClrType == typeof(DateTime?))
                        {
                            property.SetValueConverter(new ValueConverter<DateTime?, DateTime?>(
                                v => v.HasValue ? v.Value.ToUniversalTime() : (DateTime?)null, // Khi lưu, chuyển nullable DateTime? thành UTC (nếu có giá trị)
                                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : (DateTime?)null // Khi lấy dữ liệu, đặt DateTimeKind thành UTC
                            ));
                        }
                    }
                }
            }
        }
    }

}
