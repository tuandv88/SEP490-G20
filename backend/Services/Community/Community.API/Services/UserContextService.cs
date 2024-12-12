using Community.Application.Interfaces;
using System.Security.Claims;

namespace Community.API.Services;

public class UserContextService : IUserContextService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContextService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public IUserContext User => new UserContext
    {
        Id = GetUserId(),
        UserName = GetUserName(),
        Email = GetEmail(),
        FirstName = GetFirstName(),
        LastName = GetLastName(),
        Role = GetRole(),
    };

    private string GetUserName()
    {
        var context = _httpContextAccessor.HttpContext;
        return context?.User?.Identity != null && context.User.Identity.IsAuthenticated
            ? _httpContextAccessor.HttpContext?.User.FindFirst("username")?.Value!
            : null!;
    }

    private Guid GetUserId()
    
    {
        var userIdString = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value!;
        return Guid.TryParse(userIdString, out var id) ? id : Guid.Empty;
    }

    private string GetEmail()
    {
        // Duyệt qua các claims và in thông tin & debug
        //foreach (var claim in _httpContextAccessor.HttpContext?.User.Claims ?? Enumerable.Empty<Claim>())
        //{
        //    Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
        //}

        // Thử lấy email với key đơn giản trước
        var email = _httpContextAccessor.HttpContext?.User.FindFirst("email")?.Value;

        // Thêm tìm kiếm với key ClaimTypes.Email
        if (String.IsNullOrEmpty(email))
        {
            email = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
        }

        // Nếu không tìm thấy, tìm theo key đầy đủ
        if (string.IsNullOrEmpty(email))
        {
            email = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
        }

        // Nếu không tìm thấy, tìm theo key đầy đủ tiêu chuẩn OpenID Connect
        if (String.IsNullOrEmpty(email))
        {
            email = _httpContextAccessor.HttpContext?.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
        }

        return email ?? string.Empty;
    }

    private string GetFirstName()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst("firstName")?.Value!;
    }

    private string GetLastName()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst("lastName")?.Value!;
    }
    private string GetRole()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value
               ?? _httpContextAccessor.HttpContext?.User.FindFirst(c => c.Type == ClaimTypes.Role)?.Value!;
    }

    private class UserContext : IUserContext
    {
        public Guid Id { get; set; } = default;
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}
