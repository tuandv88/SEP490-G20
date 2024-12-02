using AI.Infrastructure.Data;
using Microsoft.Extensions.Configuration;
namespace AI.Infrastructure.Plugins;
public static class UtilsDbContext {
    public static string GetConfigValue(string config) {
        IConfigurationBuilder builder = new ConfigurationBuilder();
        if (File.Exists("appsettings.json"))
            builder.AddJsonFile("appsettings.json", false, true);
        IConfigurationRoot root = builder.Build();
        return root[config]!;
    }

    public static ApplicationDbContext GetDbContext() {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connStr = GetConfigValue("ConnectionStrings:DefaultConnection");
        optionsBuilder.UseNpgsql(connStr);
        ApplicationDbContext db = new ApplicationDbContext(optionsBuilder.Options);
        return db;
    }
}

