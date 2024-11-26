using Microsoft.Extensions.Configuration;
using BuildingBlocks.Email.Models;

namespace BuildingBlocks.Email.Helpers
{
    public class EmailConfigurationHelper
    {
        private readonly IConfiguration _configuration;

        public EmailConfigurationHelper(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public EmailSettings GetEmailServerSettings(string emailType)
        {
            // Lấy cấu hình cho Email từ EmailSettings theo emailType
            var emailSettings = _configuration.GetSection($"EmailSettings:{emailType}");

            if (emailSettings == null)
            {
                throw new ArgumentException($"No configuration found for email type: {emailType}");
            }

            // Lấy các cấu hình cho SMTP và IMAP và ánh xạ vào các đối tượng SmtpSettings và ImapSettings
            var smtpSettings = emailSettings.GetSection("SMTPSetting").Get<SmtpSettings>();
            var imapSettings = emailSettings.GetSection("IMAPSetting").Get<ImapSettings>();

            // Trả về thông tin cấu hình email (SMTP & IMAP)
            return new EmailSettings
            {
                DefaultFromEmail = emailSettings.GetValue<string>("DefaultFromEmail"),
                DefaultFromName = emailSettings.GetValue<string>("DefaultFromName"),
                SMTPSetting = smtpSettings,
                IMAPSetting = imapSettings
            };
        }
    }
}
