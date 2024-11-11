using FluentEmail.Core;
using MailKit;
using MailKit.Net.Imap;
using MailKit.Security;
using MimeKit;

namespace AuthServer.Repository.Services.SendMailWithModoboa
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _fluentEmail;

        public EmailService(IFluentEmail fluentEmail)
        {
            _fluentEmail = fluentEmail
                ?? throw new ArgumentNullException(nameof(fluentEmail));
        }

        public async Task Send(EmailMetadata emailMetadata)
        {
            // Send Mail
            var rs = await _fluentEmail
                .SetFrom("manhhv@icoder.vn", "Hà Mạnh")
                .To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .Body(emailMetadata.Body)
                .SendAsync();

            if (rs.Successful)
            {
                await Console.Out.WriteLineAsync("Done");

                // Save Mail To Folder
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Hà Mạnh", "manhhv@icoder.vn"));
                message.To.Add(MailboxAddress.Parse(emailMetadata.ToAddress));
                message.Subject = emailMetadata.Subject;
                message.Body = new TextPart("plain") { Text = emailMetadata.Body };

                await SaveToSentFolder(message, "manhhv@icoder.vn", "Manhhv123");
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
                    await client.ConnectAsync("mail.icoder.vn", 993, SecureSocketOptions.SslOnConnect);
                    await client.AuthenticateAsync(email, password);
                    var sentFolder = client.GetFolder(SpecialFolder.Sent);
                    await sentFolder.OpenAsync(FolderAccess.ReadWrite);

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
