using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using FluentEmail.Core;
using MailKit.Net.Imap;
using MailKit.Security;
using MailKit;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildingBlocks.Email.Services {
    public class EmailService : IEmailService {
        private readonly IFluentEmail _fluentEmail;

        public EmailService(IFluentEmail fluentEmail) {
            _fluentEmail = fluentEmail
                ?? throw new ArgumentNullException(nameof(fluentEmail));
        }

        public Task SendAndSave(EmailMetadata emailMetadata) {
            throw new NotImplementedException();
        }
    }
}
