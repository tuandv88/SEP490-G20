using AuthServer.Data;
using AuthServer.Models;
using AuthServer.Repository.Services.Profile;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BuidingBlocks.Storage;
using AuthServer.Repository.Services.Base64Converter;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Services;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using AuthServer.Repository.Services.Storage;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add DbContext 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add AspNetCore Identity 
builder.Services.AddIdentity<Users, Roles>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Options Component Identity
builder.Services.Configure<IdentityOptions>(options =>
{
    // Thiết lập về Password
    options.Password.RequireDigit = true;               // bắt buộc phải có số
    options.Password.RequireLowercase = true;           // Bắt buộc phải có chữ thường
    options.Password.RequireNonAlphanumeric = true;     // Bắt buộc ký tự đặc biệt
    options.Password.RequireUppercase = false;          // Không bắt buộc chữ in
    options.Password.RequiredLength = 8;                // Số ký tự tối thiểu của password
    options.Password.RequiredUniqueChars = 1;           // Số ký tự riêng biệt

    // Cấu hình Lockout - khóa user
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);       // Khóa 5 phút
    options.Lockout.MaxFailedAccessAttempts = 3;                            // Thất bại 3 lần thì khóa
    options.Lockout.AllowedForNewUsers = true;

    // Cấu hình về User.
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;                                 // Email là duy nhất

    // Cấu hình đăng nhập.
    options.SignIn.RequireConfirmedEmail = true;                            // Cấu hình xác thực địa chỉ email (email phải tồn tại)
    options.SignIn.RequireConfirmedPhoneNumber = false;                     // Xác thực số điện thoại
});


// Đường dẫn tới file lưu khóa RSA
var rsaKeyPath = Path.Combine(Directory.GetCurrentDirectory(), "Keys/rsa_key.pem");

// Tạo hoặc tải RSA Key từ tệp (định dạng PEM)
var rsaKey = RsaKeyHelper.GenerateOrLoadRsaKey(rsaKeyPath);

// Tạo SigningCredentials từ RSA Key và sử dụng thuật toán ký RsaSha256
var signingCredentials = new SigningCredentials(rsaKey, SecurityAlgorithms.RsaSha256);

var migrationsAssembly = typeof(Program).Assembly.GetName().Name;

// Add IdentityServer4.AspNetCoreIdentity
builder.Services.AddIdentityServer(options =>
{
    options.Events.RaiseErrorEvents = true;
    options.Events.RaiseInformationEvents = true;
    options.Events.RaiseFailureEvents = true;
    options.Events.RaiseSuccessEvents = true;

}).AddSigningCredential(signingCredentials)                                      // AddSigningCredential yêu cầu một SigningCredentials
  .AddAspNetIdentity<Users>()                                                    // Sử dụng Identity cho quản lý người dùng
  .AddProfileService<CustomProfileService>()                                     // ProfileService quản lí claims của người dùng
  .AddConfigurationStore(options =>                                              // Quản lý Client, Resource, ApiScope, IdentityResource của IdentityServer một cách động.
  {
      options.ConfigureDbContext = b => b.UseNpgsql(connectionString,            // Sử dụng UseNpgsql cho PostgreSQL
          npgsql => npgsql.MigrationsAssembly(migrationsAssembly));
  })
.AddOperationalStore(options =>                                                  // Cấu hình lưu trữ cho dữ liệu vận hành của IdentityServer như Auth Code và refresh token.
{
    options.ConfigureDbContext = b => b.UseNpgsql(connectionString,              // Sử dụng UseNpgsql cho PostgreSQL
        npgsql => npgsql.MigrationsAssembly(migrationsAssembly));
    options.EnableTokenCleanup = builder.Configuration["TokenCleanupOptions:EnableTokenCleanup"] == "true";             // Bật xóa token tự động
    options.TokenCleanupInterval = int.Parse(builder.Configuration["TokenCleanupOptions:TokenCleanupInterval"]!); ;      // Thời gian dọn dẹp token (giây)
});

// Cấu hình Google Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);   // Thời gian sống của cookie là 60 phút
    options.SlidingExpiration = true;                    // Tự động gia hạn thời gian sống khi người dùng hoạt động
    options.AccessDeniedPath = "/Account/AccessDenied";  // Đường dẫn khi truy cập bị từ chối
    options.LoginPath = "/Account/Login";                // Đường dẫn khi người dùng chưa đăng nhập
    options.LogoutPath = "/Account/Logout";              // Đường dẫn khi người dùng đăng xuất
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    googleOptions.CallbackPath = "/signin-google"; // Đảm bảo đường dẫn callback chính xác
});

builder.Services.ConfigureApplicationCookie(opts =>
{
    opts.SessionStore = new RedisCacheTicketStore(new RedisCacheOptions()
    {
        // Địa chỉ Redis và cổng
        Configuration = "109.123.238.31:32644",

        // Cấu hình mật khẩu Redis (nếu có)
        ConfigurationOptions = ConfigurationOptions.Parse("109.123.238.31:32644, password=icodervn")
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("admin"));
    options.AddPolicy("Moderator", policy => policy.RequireRole("moderator"));
    options.AddPolicy("Learner", policy => policy.RequireRole("learner"));
});


// Thêm chính sách CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Địa chỉ được phép
              .AllowAnyHeader()                    // Cho phép tất cả header
              .AllowAnyMethod()                    // Cho phép tất cả HTTP method (GET, POST, PUT, DELETE, ...)
              .AllowCredentials();                 // Cho phép gửi cookie hoặc xác thực
    });
});


// Cấu hình SendMail - Nuget: FluentMail
builder.Services.AddTransient<IEmailService, EmailService>();

// AddStorate
builder.Services.AddStorage(builder.Configuration);
builder.Services.AddScoped<IBase64Converter, Base64Converter>();

var app = builder.Build();

// Kiểm tra tham số đầu vào
if (args.Contains("/seeddata"))
{
    using (var scope = app.Services.CreateScope())
    {
        // Lấy tất cả các DbContext cần thiết
        var appDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var configDbContext = scope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        var persistedGrantDbContext = scope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>();

        // Lấy IConfiguration từ scope để truyền vào phương thức Initialize
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        // Thực hiện seeding dữ liệu
        SeedDataSample.Initialize(appDbContext, configDbContext, persistedGrantDbContext, configuration);
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Sử dụng chính sách CORS
app.UseCors("AllowSpecificOrigin");

app.UseIdentityServer();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
