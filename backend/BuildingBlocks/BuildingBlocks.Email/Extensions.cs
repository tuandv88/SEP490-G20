using FluentEmail.MailKitSmtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildingBlocks.Email {
    public static class Extensions {
        public static void AddFluentEmail(this IServiceCollection services,
            ConfigurationManager configuration) {
            var emailSettings = configuration.GetSection("EmailSettings");

            var defaultFromEmail = emailSettings["DefaultFromEmail"];
            var host = emailSettings["SMTPSetting:Host"];
            var port = emailSettings.GetValue<int>("SMTPSetting:Port");
            var userName = emailSettings["SMTPSetting:UserName"];
            var password = emailSettings["SMTPSetting:Password"];
            var useSsl = emailSettings.GetValue<bool>("SMTPSetting:UseSsl");

            services.AddFluentEmail(defaultFromEmail, "")
                .AddMailKitSender(new SmtpClientOptions {
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
