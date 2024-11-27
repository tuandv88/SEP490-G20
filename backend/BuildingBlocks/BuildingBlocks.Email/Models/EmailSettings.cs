namespace BuildingBlocks.Email.Models;

public class EmailSettings
{
    public string DefaultFromEmail { get; set; }
    public string DefaultFromName { get; set; }
    public SmtpSettings SMTPSetting { get; set; }
    public ImapSettings IMAPSetting { get; set; }
}

public class SmtpSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public bool UseSsl { get; set; }
}

public class ImapSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public bool UseSsl { get; set; }
}
