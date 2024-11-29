namespace AuthServer.Dtos.Roles
{
    public class ChangeUserRoleDto
    {
        public Guid UserId { get; set; }
        public string NewRole { get; set; }
    }

}
