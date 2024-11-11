using AuthServer.Dtos;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers
{
    [Route("auth-service/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        private readonly IPersistedGrantStore _persistedGrantStore;

        public TokensController(IPersistedGrantStore persistedGrantStore)
        {
            _persistedGrantStore = persistedGrantStore;
        }

        [HttpPost("revoke-refresh-token")]
        public async Task<IActionResult> RevokeRefreshToken([FromBody] RevokeTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.UserId))
            {
                return BadRequest(new { message = "UserId is required." });
            }

            try
            {
                // Sử dụng PersistedGrantFilter để lấy các grants liên quan đến userId
                var filter = new PersistedGrantFilter
                {
                    SubjectId = request.UserId // Lọc các grants theo userId
                };

                var userGrants = await _persistedGrantStore.GetAllAsync(filter);

                if (userGrants == null || !userGrants.Any())
                {
                    return NotFound(new { message = "No active refresh tokens found for user." });
                }

                foreach (var grant in userGrants)
                {
                    if (grant.Type == "refresh_token")
                    {
                        // Xóa Grant-type = refresh_token;
                        await _persistedGrantStore.RemoveAsync(grant.Key);
                    }
                }

                return Ok(new { message = "All active refresh tokens for the user have been successfully revoked." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while revoking the refresh tokens." });
            }
        }
    }
}
