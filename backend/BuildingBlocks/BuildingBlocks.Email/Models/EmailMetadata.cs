namespace BuildingBlocks.Email.Models {
    public class EmailMetadata {
        public string? DisplayName { get; set; } = default!;
        public string ToAddress { get; set; }
        public string Subject { get; set; }
        public string? Body { get; set; } = default!;
        public string? AttachmentPath { get; set; } = default!;
        public EmailMetadata(string toAddress, string subject, string? body = "")
        {
            ToAddress = toAddress;
            Subject = subject;
            Body = body;
        }
        public EmailMetadata(string toAddress, string subject, string? body = "",
           string? attachmentPath = "") {
            ToAddress = toAddress;
            Subject = subject;
            Body = body;
            AttachmentPath = attachmentPath;
        }
        public EmailMetadata(string toAddress, string subject,string displayName = "", string? body = "",
           string? attachmentPath = "") {
            ToAddress = toAddress;
            Subject = subject;
            DisplayName = displayName;
            Body = body;
            AttachmentPath = attachmentPath;
        }
    }
}
