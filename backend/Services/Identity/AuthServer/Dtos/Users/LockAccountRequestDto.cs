namespace AuthServer.Dtos.Users
{
    public class LockAccountRequestDto
    {
        public Guid UserId { get; set; }
        public DateTime LockoutTimeUtc { get; set; }
    }
}
