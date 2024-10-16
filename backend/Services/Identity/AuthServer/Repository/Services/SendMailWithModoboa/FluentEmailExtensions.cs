using FluentEmail.MailKitSmtp;

namespace AuthServer.Repository.Services.SendMailWithModoboa
{
    public static class FluentEmailExtensions
    {
        // Cấu hình SMTP
        public static void AddFluentEmail(this IServiceCollection services, ConfigurationManager configuration)
        {
            var emailSettings = configuration.GetSection("EmailSettings");

            var defaultFromEmail = emailSettings["DefaultFromEmail"];
            var host = emailSettings["SMTPSetting:Host"];
            var port = emailSettings.GetValue<int>("SMTPSetting:Port");
            var userName = emailSettings["SMTPSetting:UserName"];
            var password = emailSettings["SMTPSetting:Password"];
            var useSsl = emailSettings.GetValue<bool>("SMTPSetting:UseSsl");

            services.AddFluentEmail(defaultFromEmail)
                .AddMailKitSender(new SmtpClientOptions
                {
                    Server = host,
                    Port = port,
                    User = userName,
                    Password = password,
                    UseSsl = useSsl,
                    RequiresAuthentication = true
                });
        }
    }
}
