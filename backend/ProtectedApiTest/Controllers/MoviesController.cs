using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProtectedApiTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]  // Bảo vệ API này bằng xác thực
    public class MoviesController : ControllerBase
    {
        // Một API trả về danh sách phim
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Get()
        {
            var movies = new[]
            {
                new { Title = "The Shawshank Redemption", Year = 1994 },
                new { Title = "The Godfather", Year = 1972 },
                new { Title = "The Dark Knight", Year = 2008 },
            };

            return Ok(movies);  // Trả về danh sách phim
        }
    }
}
