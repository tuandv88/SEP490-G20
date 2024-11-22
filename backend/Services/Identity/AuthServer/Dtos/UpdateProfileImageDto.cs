namespace AuthServer.Dtos
{
    public class UpdateProfileImageDto
    {
        public Guid UserId { get; set; }          // ID của người dùng
        public string FileName { get; set; }      // Tên file ảnh
        public string Base64Image { get; set; }   // Nội dung ảnh ở định dạng Base64
        public string ContentType { get; set; }   // Loại nội dung của ảnh
    }
}
