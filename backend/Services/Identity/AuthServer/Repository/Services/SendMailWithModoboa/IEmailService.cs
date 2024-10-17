namespace AuthServer.Repository.Services.SendMailWithModoboa
{
    public interface IEmailService
    {
        Task Send(EmailMetadata emailMetadata);
    }
}
