using BuildingBlocks.Email.Models;

namespace BuildingBlocks.Email.Interfaces {
    public interface IEmailService {
        Task SendAndSave(EmailMetadata emailMetadata);
    }
}
