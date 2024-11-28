namespace AuthServer.Dtos.Roles
{
    public class UpdateRoleRequestDto
    {
        public string UserId { get; set; }  // Hoặc có thể sử dụng Email thay vì UserId
        public string RoleId { get; set; }  // RoleId thay vì RoleName
    }
}
