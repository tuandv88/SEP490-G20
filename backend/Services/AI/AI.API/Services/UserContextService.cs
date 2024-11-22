using AI.Application.Interfaces;
using System.Security.Claims;

namespace AI.API.Services;
public class UserContextService : IUserContextService {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContextService(IHttpContextAccessor httpContextAccessor) {
        _httpContextAccessor = httpContextAccessor;
    }

    public IUserContext User => new UserContext {
        Id = GetUserId(),
        UserName = GetUserName(),
        Email = GetEmail(),
        FirstName = GetFirstName(),
        LastName = GetLastName(),
        Role = GetRole(),
    };

    private string GetUserName() {
        var context = _httpContextAccessor.HttpContext;
        return context?.User?.Identity != null && context.User.Identity.IsAuthenticated
            ? _httpContextAccessor.HttpContext?.User.FindFirst("username")?.Value!
            : null!;
    }

    private Guid GetUserId() {
        var userIdString = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value!;
        return Guid.TryParse(userIdString, out var id) ? id : Guid.Empty;
    }

    private string GetEmail() {
        return _httpContextAccessor.HttpContext?.User.FindFirst("email")?.Value!;
    }

    private string GetFirstName() {
        return _httpContextAccessor.HttpContext?.User.FindFirst("firstName")?.Value!;
    }

    private string GetLastName() {
        return _httpContextAccessor.HttpContext?.User.FindFirst("lastName")?.Value!;
    }
    private string GetRole() {
        return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value
               ?? _httpContextAccessor.HttpContext?.User.FindFirst(c => c.Type == ClaimTypes.Role)?.Value!;
    }

    private class UserContext : IUserContext {
        public Guid Id { get; set; } = default;
        public string UserName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}


