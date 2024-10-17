using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoviesClient.Models;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Diagnostics;

namespace MoviesClient.Controllers
{
    [Authorize]
    public class MovieController : Controller
    {
        public IActionResult Index()
        {
            var movies = new List<Movie>
        {
            new Movie
            {
                Id = 1,
                Genre = "Drama",
                Title = "The Shawshank Redemption",
                Rating = "9.3",
                ImageUrl = "images/src",
                ReleaseDate = new DateTime(1994, 5, 5),
                Owner = "alice"
            },
            // Bạn có thể thêm các Movie khác tại đây
            new Movie
            {
                Id = 2,
                Genre = "Action",
                Title = "The Dark Knight",
                Rating = "9.0",
                ImageUrl = "images/dark_knight.jpg",
                ReleaseDate = new DateTime(2008, 7, 18),
                Owner = "bob"
            },
            new Movie
            {
                Id = 3,
                Genre = "Comedy",
                Title = "The Big Lebowski",
                Rating = "8.1",
                ImageUrl = "images/big_lebowski.jpg",
                ReleaseDate = new DateTime(1998, 3, 6),
                Owner = "charlie"
            }
        };
            //LogTokenAndClaims();
            return View(movies);
        }

        public async Task Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
        }

        public async Task LogTokenAndClaims()
        {
            var identityToken = await HttpContext.GetTokenAsync(OpenIdConnectParameterNames.IdToken);

            Console.WriteLine($"Identity token: {identityToken}");

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim type: {claim.Type} - Claim value: {claim.Value}");
            }
        }
    }
}
