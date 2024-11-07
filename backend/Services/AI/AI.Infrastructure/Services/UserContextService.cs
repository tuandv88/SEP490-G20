using AI.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AI.Infrastructure.Services {
    public class UserContextService : IUserContextService {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor) {
            _httpContextAccessor = httpContextAccessor;
        }

        public IUserContext User => new UserContext {
            Id = Guid.TryParse(GetUserId(), out var id) ? id : null,
            UserName = GetUserName()
        };

        private string GetUserName() {
            var context = _httpContextAccessor.HttpContext;
            return context?.User?.Identity != null && context.User.Identity.IsAuthenticated
                ? context.User.Identity.Name ?? "system"
                : "system";
        }

        private string GetUserId() {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value ?? "system";
        }

        private class UserContext : IUserContext {
            public Guid? Id { get; set; } = default;
            public string UserName { get; set; } = default!;
        }
    }
}
