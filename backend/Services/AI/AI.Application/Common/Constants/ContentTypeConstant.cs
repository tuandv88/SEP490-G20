namespace AI.Application.Common.Constants;
public static class ContentTypeConstant {
    public static class Document {
        public const string Pdf = "application/pdf";
        public const string WordDoc = "application/msword";
        public const string WordDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        public const string PowerPointPpt = "application/vnd.ms-powerpoint";
        public const string PowerPointPptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        public const string ExcelXls = "application/vnd.ms-excel";
        public const string ExcelXlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        public static readonly string[] AllowedDocumentTypes =
            {Pdf, WordDoc, WordDocx, PowerPointPpt, PowerPointPptx, ExcelXls, ExcelXlsx};
    }
    public static class Web {
        public const string Html = "text/html";
        public const string PlainText = "text/plain";
        public const string Xml = "application/xml";
        public const string Json = "application/json";
        public const string Uri = "text/x-uri";
        public static readonly string[] AllowedWebTypes =
            { Html, PlainText, Xml, Json, Uri };
    }
}
