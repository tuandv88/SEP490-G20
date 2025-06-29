﻿using BuildingBlocks.Email.Models;

namespace BuildingBlocks.Email.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAndSaveAsync(EmailMetadata emailMetadata, string emailType);
    }
}
