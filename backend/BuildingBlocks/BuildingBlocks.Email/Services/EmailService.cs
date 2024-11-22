using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using FluentEmail.Core;
using MailKit.Net.Imap;
using MailKit.Security;
using MailKit;
using MimeKit;

namespace BuildingBlocks.Email.Services {
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _fluentEmail;

        public EmailService(IFluentEmail fluentEmail)
        {
            _fluentEmail = fluentEmail
                ?? throw new ArgumentNullException(nameof(fluentEmail));
        }

        public async Task SendAndSave(EmailMetadata emailMetadata)
        {
            // Gửi email
            var rs = await _fluentEmail
                .SetFrom("verify@icoder.vn", "Icoder")
                .To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .Body(emailMetadata.Body)
                .SendAsync();

            if (rs.Successful)
            {
                await Console.Out.WriteLineAsync("Email sent successfully.");

                // Lưu email vào thư mục "Sent"
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Icoder", "verify@icoder.vn"));
                message.To.Add(MailboxAddress.Parse(emailMetadata.ToAddress));
                message.Subject = emailMetadata.Subject;
                message.Body = new TextPart("plain") { Text = emailMetadata.Body };

                await SaveToSentFolder(message, "verify@icoder.vn", "icodervn");
            }
            else
            {
                Console.WriteLine("Failed to send email:");
                foreach (var error in rs.ErrorMessages)
                {
                    Console.WriteLine(error);
                }
            }
        }

        private async Task SaveToSentFolder(MimeMessage message, string email, string password)
        {
            using (var client = new ImapClient())
            {
                try
                {
                    // Kết nối tới máy chủ IMAP
                    await client.ConnectAsync("mail.icoder.vn", 993, SecureSocketOptions.SslOnConnect);
                    await client.AuthenticateAsync(email, password);

                    // Mở thư mục "Sent"
                    var sentFolder = client.GetFolder(SpecialFolder.Sent);
                    await sentFolder.OpenAsync(FolderAccess.ReadWrite);

                    // Lưu email vào thư mục "Sent"
                    await sentFolder.AppendAsync(message);

                    await Console.Out.WriteLineAsync("Email saved to 'Sent' folder successfully.");

                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    await Console.Out.WriteLineAsync($"Failed to save email to 'Sent' folder: {ex.Message}");
                }
            }
        }
    }
}
