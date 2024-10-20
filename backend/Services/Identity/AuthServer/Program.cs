using AuthServer.Config;
using AuthServer.Data;
using AuthServer.Models;
using AuthServer.Repository.Services;
using AuthServer.Repository.Services.SendMailWithModoboa;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add DbContext 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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


// Add IdentityServer4.AspNetCoreIdentity
builder.Services.AddIdentityServer(options =>
{
    options.Events.RaiseErrorEvents = true;
    options.Events.RaiseInformationEvents = true;
    options.Events.RaiseFailureEvents = true;
    options.Events.RaiseSuccessEvents = true;

}).AddDeveloperSigningCredential()
  .AddAspNetIdentity<Users>()
  .AddInMemoryClients(ClientConfig.GetClients)
  .AddInMemoryApiResources(ApiResourcesConfig.GetApiResources)
  .AddInMemoryApiScopes(ApiScopesConfig.GetApiScopes)
  .AddInMemoryIdentityResources(IdentityResourcesConfig.GetIdentityResources)
  .AddProfileService<ProfileService>();

// Cấu hình Google Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromMinutes(15);   // Thời gian sống của cookie là 15 phút
    options.SlidingExpiration = true;                    // Tự động gia hạn thời gian sống khi người dùng hoạt động
    options.AccessDeniedPath = "/Account/accessdenied";  // Đường dẫn khi truy cập bị từ chối
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    googleOptions.CallbackPath = "/signin-google"; // Đảm bảo đường dẫn callback chính xác
});


// Cấu hình SendMail - Nuget: FluentMail
builder.Services.AddFluentEmail(builder.Configuration);
builder.Services.AddTransient<IEmailService, EmailService>();


var app = builder.Build();

// Kiểm tra tham số đầu vào
if (args.Contains("/seeddata"))
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        SeedDataSample.Initialize(context);
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

app.UseIdentityServer();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");

app.Run();
