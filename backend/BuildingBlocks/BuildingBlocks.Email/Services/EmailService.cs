using BuildingBlocks.Email.Models;
using MailKit.Net.Imap;
using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Helpers;

namespace BuildingBlocks.Email.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfigurationHelper _emailConfigHelper;

        public EmailService(IConfiguration configuration)
        {
            _emailConfigHelper = new EmailConfigurationHelper(configuration);
        }

        public async Task SendEmailAndSaveAsync(EmailMetadata emailMetadata, string emailType)
        {
            // Lấy cấu hình email từ EmailConfigurationHelper
            var emailServerSettings = _emailConfigHelper.GetEmailServerSettings(emailType);

            // Tạo message email ( MimeMessage) - Dùng để gửi mail
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(emailServerSettings.DefaultFromName, emailServerSettings.DefaultFromEmail));
            message.To.Add(new MailboxAddress(emailMetadata.ToAddress));
            message.Subject = emailMetadata.Subject;

            // Cấu hình body email (html)
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = emailMetadata.Body
            };

            // Thêm tệp đính kèm nếu có
            if (!string.IsNullOrEmpty(emailMetadata.AttachmentPath))
            {
                bodyBuilder.Attachments.Add(emailMetadata.AttachmentPath);
            }
            message.Body = bodyBuilder.ToMessageBody();

            // Sử dụng SMTPClient để gửi email (ssl = false)
            using (var client = new SmtpClient())
            {
                try
                {
                    // Kết nối với máy chủ SMTP bất đồng bộ
                    await client.ConnectAsync(emailServerSettings.SMTPSetting.Host, emailServerSettings.SMTPSetting.Port, emailServerSettings.SMTPSetting.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);

                    // Xác thực với tên người dùng và mật khẩu bất đồng bộ
                    await client.AuthenticateAsync(emailServerSettings.SMTPSetting.UserName, emailServerSettings.SMTPSetting.Password);

                    // Gửi email bất đồng bộ
                    await client.SendAsync(message);
                    Console.WriteLine($"Email type {emailType} sent successfully.");

                    // Lưu email vào thư mục "Sent" trên IMAP server
                    await SaveToSentFolderAsync(message, emailServerSettings.IMAPSetting);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
                finally
                {
                    // Ngắt kết nối sau khi gửi email bất đồng bộ
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }

        private async Task SaveToSentFolderAsync(MimeMessage message, ImapSettings imapSettings)
        {
            // Sử dụng IMap để lưu mail ( ssl = true )
            using (var client = new ImapClient())
            {
                try
                {
                    // Kết nối tới máy chủ IMAP
                    await client.ConnectAsync(imapSettings.Host, imapSettings.Port, imapSettings.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(imapSettings.UserName, imapSettings.Password);

                    // Mở thư mục "Sent"
                    var sentFolder = client.GetFolder(MailKit.SpecialFolder.Sent);
                    await sentFolder.OpenAsync(MailKit.FolderAccess.ReadWrite);

                    // Lưu email vào thư mục "Sent"
                    await sentFolder.AppendAsync(message);

                    Console.WriteLine("Email saved to 'Sent' folder successfully.");

                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to save email to 'Sent' folder: {ex.Message}");
                }
            }
        }
    }
}
