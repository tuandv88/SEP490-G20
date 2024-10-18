using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Cấu hình dịch vụ xác thực (Authentication)
builder.Services.AddAuthentication(options =>
{
    // Thiết lập scheme mặc định cho xác thực và xử lý thách thức
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme) // Thêm xác thực dựa trên cookie
    .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
    {
        // Cấu hình các tùy chọn cho OpenID Connect
        options.Authority = "https://localhost:5001"; // URL của nhà cung cấp Identity (IdP)
        options.ClientId = "movies_mvc_client";       // ID của client đã đăng ký với IdP
        options.ClientSecret = "secret";              // Secret của client để xác thực
        options.ResponseType = "code";                // Sử dụng flow 'authorization code'

        // Thêm các scope cần thiết cho OpenID Connect
        options.Scope.Add("openid");   // Yêu cầu để xác thực người dùng
        options.Scope.Add("profile");  // Cho phép lấy thông tin cơ bản của người dùng
        options.Scope.Add("email");

        options.SaveTokens = true;                    // Lưu token để sử dụng sau này
        options.GetClaimsFromUserInfoEndpoint = true; // Lấy các claim của người dùng từ endpoint UserInfo
    });

IdentityModelEventSource.ShowPII = true;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
