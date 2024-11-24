using Community.Application.Commons;
using Microsoft.Extensions.DependencyInjection;

namespace Community.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices
        (this IServiceCollection services, IConfiguration configuration)
        {
            // Cấu hình MediatR
            services.AddMediatR(config => {
                config.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());            // Đăng ký các yêu cầu và xử lý trong assembly hiện tại
                config.AddOpenBehavior(typeof(ValidationBehavior<,>));                           // Thêm hành vi kiểm tra ValidationBehavior cho các yêu cầu
                config.AddOpenBehavior(typeof(AuthorizationBehavior<,>));
            });
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());                 // Đăng ký các validator từ assembly hiện tại

            //Storage 
            services.AddStorage(configuration);
            
            return services;
        }
    }
}





