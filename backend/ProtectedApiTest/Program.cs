using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();


// Thêm dịch vụ Swagger
// dotnet add package Swashbuckle.AspNetCore
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ProtectedApiTest",
        Version = "v1"
    });

    // Thêm cấu hình cho JWT Bearer trong Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Thêm dịch vụ CORS và xác thực JWT
builder.Services.AddCors(options =>
{
    options.AddPolicy("default", policy =>
    {
        policy.WithOrigins("https://localhost:5003")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "https://localhost:5001";  // URL của IdentityServer
        options.Audience = "moviesApi";                // Phải khớp với scope `moviesApi` trong cấu hình IdentityServer
        options.RequireHttpsMetadata = true;
    });


builder.Services.AddControllers();

var app = builder.Build();

// Cấu hình Swagger middleware (Chỉ kích hoạt ở môi trường Development)
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Movies API V1");
        //c.RoutePrefix = string.Empty;  // Đặt Swagger UI tại đường dẫn gốc
    });
}



app.UseHttpsRedirection();  // Chuyển hướng tới HTTPS nếu cần
// Cấu hình pipeline
app.UseRouting();

app.UseCors("default");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Chạy ứng dụng
app.Run();
