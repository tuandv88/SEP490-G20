using AuthServer.Models;
using AuthServer.Models.AccountViewModel;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Encodings.Web;
using System.Text;
using MailKit;
using AuthServer.Repository.Services.SendMailWithModoboa;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Org.BouncyCastle.Bcpg.Sig;
using Microsoft.AspNetCore.Authorization;

namespace AuthServer.Controllers
{
    public class AccountController : Controller
    {
        private readonly IIdentityServerInteractionService _interactionService;
        private readonly IDataProtector _protector;
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly IEmailService _emailService;
        private readonly UrlEncoder _urlEncoder;
        public AccountController(IIdentityServerInteractionService interactionService, IDataProtectionProvider provider,
                                  SignInManager<Users> signInManager, UserManager<Users> userManager,
                                  IEmailService emailService, UrlEncoder urlEncoder)
        {
            _interactionService = interactionService;
            _protector = provider.CreateProtector("AuthServer.Cookies");

            _signInManager = signInManager;
            _userManager = userManager;


            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));

            _urlEncoder = urlEncoder;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            ViewData["ReturnUrl"] = returnUrl;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            if (ModelState.IsValid)
            {
                var user = new Users
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DateOfBirth = model.Dob,
                    ProfilePicture = string.Empty,
                    Bio = string.Empty,
                    Address = string.Empty
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    Console.WriteLine("User created a new account with password.");

                    var userId = await _userManager.GetUserIdAsync(user);

                    // Tạo mới Token
                    string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    // Đặt thời gian hết hạn mới (ví dụ 5 phút sau)
                    DateTime newExpirationTime = DateTime.UtcNow.AddMinutes(5);

                    // Lưu token mới vào cơ sở dữ liệu
                    await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", $"{code}|{newExpirationTime.Ticks}");

                    // Mã hóa token 
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                    var callbackUrl = Url.Action(
                        action: "ConfirmEmail",
                        controller: "Account",
                        values: new { userId = userId, code = code, expiration = newExpirationTime.Ticks, returnUrl = returnUrl },
                        protocol: Request.Scheme);

                    var emailBody = $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>Confirm Email</a>";

                    var emailMetadata = new EmailMetadata(
                        toAddress: model.Email,
                        subject: "Confirm your email",
                        body: emailBody
                    );

                    await _emailService.Send(emailMetadata);

                    TempData["ConfirmEmailSuccessMessage"] = "Registration successful! Please check your email and confirm your account.";

                    // Chuyển hướng đến trang thông báo thành công
                    return RedirectToAction("RegistrationConfirmation", "Account", new { fullName = $"{model.FirstName} {model.LastName}", email = model.Email });

                    //return RedirectToAction("Login", "Account");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult RegistrationConfirmation(string fullName, string email)
        {
            ViewData["FullName"] = fullName;
            ViewData["Email"] = email;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ResendEmailConfirmation(string email, string fullName, string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            if (string.IsNullOrEmpty(email))
            {
                TempData["ConfirmEmailFailMessage"] = "Email address is required.";
                return RedirectToAction("RegistrationConfirmation", "Account");
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                TempData["ConfirmEmailFailMessage"] = "We could not find a user with that email address.";
                return RedirectToAction("RegistrationConfirmation", "Account");
            }

            // Kiểm tra xem email đã được xác nhận chưa
            if (await _userManager.IsEmailConfirmedAsync(user))
            {
                TempData["ConfirmEmailFailMessage"] = "Email is already confirmed.";
                return RedirectToAction("RegistrationConfirmation", "Account");
            }

            await HandleEmailConfirmationAsync(user, returnUrl);

            TempData["ConfirmEmailSuccessMessage"] = "A new confirmation email has been sent. Please check your inbox.";
            return RedirectToAction("RegistrationConfirmation", "Account", new { fullName = fullName, email = user.Email });
        }


        // Dùng cho Register
        private async Task<(string token, DateTime? expiration)> GetEmailConfirmationTokenAsync(Users user, string nameUserToken)
        {
            // Lấy token đã tồn tại trong bảng AspNetUserTokens
            var tokens = await _userManager.GetAuthenticationTokenAsync(user, "Default", nameUserToken);

            if (tokens != null)
            {
                // Giải mã token và kiểm tra thời hạn
                var tokenParts = tokens.Split('|');

                if (tokenParts.Length == 2)
                {
                    // Tách token và thời gian hết hạn
                    var token = tokenParts[0];
                    var expirationTicksString = tokenParts[1];

                    Console.WriteLine("Token: " + token);
                    Console.WriteLine("Expiration Ticks: " + expirationTicksString);

                    // Kiểm tra xem có thể chuyển đổi expirationTicks sang long hay không
                    if (long.TryParse(expirationTicksString, out long expirationTicks))
                    {
                        var expirationTime = new DateTime(expirationTicks);

                        Console.WriteLine("Parsed Expiration Time: " + expirationTime);

                        if (DateTime.UtcNow < expirationTime)
                        {
                            // Token còn hạn sử dụng
                            return (token, expirationTime);
                        }
                    }
                }
            }

            // Nếu không có token hoặc token đã hết hạn, trả về null
            return (null, null);
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string code, long? expiration, string returnUrl = null)
        {
            if (userId == null || code == null || expiration == null)
            {
                return RedirectToAction("Index", "Home");
            }

            // Tìm người dùng theo ID
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                TempData["MessageInfo"] = "User not found.";
                return View();
            }

            // Giải mã mã xác nhận về dạng ban đầu
            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));

            // Kiểm tra thời gian hết hạn
            var expirationTime = new DateTime(expiration.Value);
            if (DateTime.UtcNow > expirationTime)
            {
                await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", "InvalidToken");

                TempData["MessageInfo"] = "The confirmation link has expired. Please try again.";
                return View();
            }

            // Gọi phương thức để lấy token và thời hạn của token
            string nameTokenUser = "EmailConfirmationToken";
            var tokenResult = await GetEmailConfirmationTokenAsync(user, nameTokenUser);

            // Gán giá trị trả về vào các biến
            var existingToken = tokenResult.token;       // Token hiện tại (nếu có)
            var expirationTimeFromDb = tokenResult.expiration; // Thời gian hết hạn của token (nếu có)

            // Kiểm tra nếu token tồn tại và hợp lệ
            if (existingToken == null || existingToken != code)
            {
                TempData["MessageInfo"] = "Invalid or expired confirmation token.";
                return View();
            }

            // Xác nhận email của người dùng
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                // Sau khi xác nhận thành công, cập nhật token thành không hợp lệ
                // Cách 1: Xóa token khỏi cơ sở dữ liệu
                //await _userManager.RemoveAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken");

                // Cách 2: Cập nhật token thành một chuỗi không hợp lệ (tuỳ chọn)
                await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", "InvalidToken");

                TempData["MessageInfo"] = "Your email has been confirmed successfully!";
            }
            else
            {
                TempData["MessageInfo"] = "Error confirming your email. Please try again.";
            }

            return View();
        }


        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            returnUrl ??= Url.Content("~/");

            ViewData["ReturnUrl"] = returnUrl;

            // Kiểm tra cookie và tự động điền thông tin đăng nhập
            var username = Request.Cookies["Username"];
            var encryptedPassword = Request.Cookies["Password"];

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(encryptedPassword))
            {
                // Giải mã mật khẩu
                var decryptedPassword = await Task.Run(() => _protector.Unprotect(encryptedPassword));

                var model = new LoginViewModel
                {
                    UsernameOrEmail = username,
                    Password = decryptedPassword,
                    RememberMe = true
                };

                return View(model);
            }

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();

                var errorMessage = string.Join(", ", errors);
                ModelState.AddModelError(string.Empty, errorMessage);
                return View(model);
            }


            Users user = null;


            user = await _userManager.FindByNameAsync(model.UsernameOrEmail);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(model.UsernameOrEmail);
            }

            var result = await _signInManager.PasswordSignInAsync(model.UsernameOrEmail, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                if (user != null)
                {
                    result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: true);
                }
            }

            if (result.Succeeded)
            {
                if (model.RememberMe)
                {
                    var cookieOptions = new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(1),  // Cookie tồn tại trong 30 ngày
                        Secure = true,
                        HttpOnly = true                     // Đảm bảo bảo mật cho username
                    };

                    // Lưu username và mật khẩu đã mã hóa
                    var encryptedPassword = _protector.Protect(model.Password);
                    Response.Cookies.Append("Username", model.UsernameOrEmail, cookieOptions);

                    // Mật khẩu chỉ lưu 5 phút để hạn chế rủi ro bảo mật
                    var passwordCookieOptions = new CookieOptions
                    {
                        Expires = DateTime.Now.AddMinutes(1), // Cookie mật khẩu tồn tại ngắn hơn
                        Secure = true,
                        HttpOnly = false                      // Không đặt HttpOnly để có thể tự động điền lại
                    };

                    Response.Cookies.Append("Password", encryptedPassword, passwordCookieOptions);
                }
                else
                {
                    // Xóa cookie nếu không chọn RememberMe
                    Response.Cookies.Delete("Username");
                    Response.Cookies.Delete("Password");
                }

                Console.WriteLine("Login Successful");

                if (_interactionService.IsValidReturnUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    return Redirect("/Home");
                }
            }

            if (user != null)
            {
                var emailConfirmAccount = await _userManager.IsEmailConfirmedAsync(user);

                if (!emailConfirmAccount)
                {
                    await HandleEmailConfirmationAsync(user, returnUrl);

                    ModelState.AddModelError(string.Empty, "Check your email & verify your account !");
                    return View(model);
                }
            }

            //if (result.RequiresTwoFactor)
            //{
            //    if (user != null)
            //    {
            //        Console.WriteLine("Login - Two Face.");

            //        var userEmail = await _userManager.GetEmailAsync(user);
            //        // Tạo mã xác nhận email
            //        var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

            //        var emailBody = $"Icoder: Your verification code is: {token}";

            //        var emailMetadata = new EmailMetadata(
            //            toAddress: userEmail,
            //            subject: "Confirm your email",
            //            body: emailBody
            //        );

            //        // Gửi email xác nhận
            //        await _emailService.Send(emailMetadata);

            //        return RedirectToAction("TwoFaceLogin", "Account", new { email = userEmail });
            //    }
            //}


            if (result.RequiresTwoFactor)
            {
                if (user != null)
                {
                    return RedirectToAction("LoginVerifyAuthenicatorCode", "Account", new { returnUrl, model.RememberMe });
                }
            }

            if (result.IsLockedOut)
            {
                await HandleLockedOutUser(user);
                return View(model);
            }

            ModelState.AddModelError(string.Empty, "Check your UserName / Email & Password - Enter Again!");
            return View(model);
        }

        private async Task HandleEmailConfirmationAsync(Users user, string returnUrl)
        {
            var userId = await _userManager.GetUserIdAsync(user);
            var userEmail = await _userManager.GetEmailAsync(user);

            string nameTokenUser = "EmailConfirmationToken";
            var tokenResult = await GetEmailConfirmationTokenAsync(user, nameTokenUser);

            var existingToken = tokenResult.token;       // Token hiện tại (nếu có)
            var expirationTime = tokenResult.expiration; // Thời gian hết hạn của token (nếu có)

            string code;
            DateTime newExpirationTime;

            // Kiểm tra token hiện tại
            if (existingToken != null && expirationTime.HasValue)
            {
                if (DateTime.UtcNow > expirationTime.Value)
                {
                    // Nếu token đã hết hạn, tạo lại token mới
                    code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    // Cập nhật thời gian hết hạn mới (ví dụ 5 phút sau)
                    newExpirationTime = DateTime.UtcNow.AddMinutes(5);

                    // Cập nhật lại token mới và thời hạn vào cơ sở dữ liệu
                    await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", $"{code}|{newExpirationTime.Ticks}");
                }
                else
                {
                    // Sử dụng lại token cũ nếu vẫn còn hạn
                    code = existingToken;
                    newExpirationTime = expirationTime.Value;
                }
            }
            else
            {
                // Nếu không có token, tạo mới
                code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Đặt thời gian hết hạn mới (ví dụ 5 phút sau)
                newExpirationTime = DateTime.UtcNow.AddMinutes(5);

                // Lưu token mới vào cơ sở dữ liệu
                await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", $"{code}|{newExpirationTime.Ticks}");
            }

            // Mã hóa token
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var callbackUrl = Url.Action(
                action: "ConfirmEmail",
                controller: "Account",
                values: new { userId = userId, code = code, expiration = newExpirationTime.Ticks, returnUrl = returnUrl },
                protocol: Request.Scheme);

            var emailBody = $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>Confirm Email</a>";

            var emailMetadata = new EmailMetadata(
                toAddress: userEmail,
                subject: "Confirm your email",
                body: emailBody
            );

            // Gửi email xác nhận
            await _emailService.Send(emailMetadata);
        }

        private async Task HandleLockedOutUser(Users user)
        {
            Console.WriteLine("Login Failed: Account is Locked");

            // Kiểm tra nếu tài khoản bị khóa và thời gian khóa còn hiệu lực
            if (user != null && user.LockoutEnd.HasValue && user.LockoutEnd.Value.UtcDateTime > DateTime.UtcNow)
            {
                // Tính thời gian khóa còn lại
                var lockoutEndTime = user.LockoutEnd.Value.UtcDateTime;
                var minutesLeft = (lockoutEndTime - DateTime.UtcNow).TotalMinutes;

                // Thêm thông báo hiển thị số phút còn lại
                ModelState.AddModelError(string.Empty, $"Account locked - Please try again later after {Math.Ceiling(minutesLeft)} minutes!");
            }
            else
            {
                // Nếu không thể xác định thời gian, sử dụng thông báo mặc định
                ModelState.AddModelError(string.Empty, "Account locked - Please try again later!");
            }
        }


        // Phương thức xử lý đăng nhập bằng Google
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            // Redirect to Google for authentication
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { ReturnUrl = returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return RedirectToAction(nameof(Login));
            }

            // Kiểm tra người dùng đã tồn tại trong cơ sở dữ liệu chưa
            var user = await _userManager.FindByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email));

            if (user == null)
            {
                // Người dùng chưa tồn tại, tạo mới
                user = new Users
                {
                    UserName = info.Principal.FindFirstValue(ClaimTypes.Email),
                    Email = info.Principal.FindFirstValue(ClaimTypes.Email),
                    FirstName = info.Principal.FindFirstValue("given_name") ?? string.Empty,
                    LastName = info.Principal.FindFirstValue("family_name") ?? string.Empty,
                    DateOfBirth = DateTime.TryParse(info.Principal.FindFirstValue("birthdate"), out var birthDate) ? birthDate : DateTime.MinValue,
                    ProfilePicture = info.Principal.FindFirstValue("picture") ?? string.Empty,
                    Bio = string.Empty,
                    Address = string.Empty
                };

                var result = await _userManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    await _userManager.AddLoginAsync(user, info);
                }
                else
                {
                    return RedirectToAction("Login");
                }
            }

            // Đăng nhập người dùng
            await _signInManager.SignInAsync(user, isPersistent: false);

            bool checkTwoFactor = await _userManager.GetTwoFactorEnabledAsync(user);

            // Kiểm tra người dùng có bật xác thực 2 yếu tố không
            if (checkTwoFactor)
            {
                // Nếu có, chuyển hướng đến trang xác thực mã
                return RedirectToAction("LoginVerifyAuthenicatorCode", "Account", new { returnUrl });
            }

            return LocalRedirect(returnUrl ?? "/");
        }

        [HttpGet]
        public IActionResult TwoFaceLogin(string email)
        {
            var model = new TwoFaceLoginViewModel
            {
                Email = email,
                TokenExpiry = DateTime.UtcNow.AddMinutes(1) // Dùng UTC
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> TwoFaceLogin(TwoFaceLoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Kiểm tra token có hết hạn chưa
            if (DateTime.UtcNow > model.TokenExpiry)
            {
                ViewBag.StatusCode = "Token has expired.";
                return View(model);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                var result = await _userManager.VerifyTwoFactorTokenAsync(user, "Email", model.Code);
                if (result)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ViewBag.StatusCode = "Code Invalid";
                    return View(model);
                }
            }

            ViewBag.StatusCode = "Can not find User!";
            return View(model);
        }



        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
                {

                    var userId = await _userManager.GetUserIdAsync(user);
                    var userEmail = await _userManager.GetEmailAsync(user);

                    // Gọi phương thức để lấy token và thời hạn của token
                    string nameTokenUser = "PasswordConfirmationToken";
                    var tokenResult = await GetEmailConfirmationTokenAsync(user, nameTokenUser);

                    // Gán giá trị trả về vào các biến
                    var existingToken = tokenResult.token;       // Token hiện tại (nếu có)
                    var expirationTime = tokenResult.expiration; // Thời gian hết hạn của token (nếu có)

                    string code;
                    DateTime newExpirationTime;

                    // Kiểm tra token hiện tại
                    if (existingToken != null && expirationTime.HasValue)
                    {
                        if (DateTime.UtcNow > expirationTime.Value)
                        {
                            // Nếu token đã hết hạn, tạo lại token mới
                            code = await _userManager.GeneratePasswordResetTokenAsync(user);

                            // Cập nhật thời gian hết hạn mới (ví dụ 5 phút sau)
                            newExpirationTime = DateTime.UtcNow.AddMinutes(1);

                            // Cập nhật lại token mới và thời hạn vào cơ sở dữ liệu
                            await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, $"{code}|{newExpirationTime.Ticks}");
                        }
                        else
                        {
                            // Sử dụng lại token cũ nếu vẫn còn hạn
                            code = existingToken;
                            newExpirationTime = expirationTime.Value;
                        }
                    }
                    else
                    {
                        // Nếu không có token, tạo mới
                        code = await _userManager.GeneratePasswordResetTokenAsync(user);

                        // Đặt thời gian hết hạn mới (ví dụ 5 phút sau)
                        newExpirationTime = DateTime.UtcNow.AddMinutes(1);

                        // Lưu token mới vào cơ sở dữ liệu
                        await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, $"{code}|{newExpirationTime.Ticks}");
                    }

                    // Mã hóa token
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                    var callbackUrl = Url.Action(
                        action: "ResetPassword",
                        controller: "Account",
                        values: new { email = model.Email, code = code, expiration = newExpirationTime.Ticks },
                        protocol: Request.Scheme);

                    var emailBody = $"Reset password by clicking this link: <a href='{callbackUrl}'>Reset Password</a>";

                    var emailMetadata = new EmailMetadata(
                        toAddress: model.Email,
                        subject: "Reset Password",
                        body: emailBody
                    );

                    // Gửi email xác nhận
                    await _emailService.Send(emailMetadata);
                }

                // Sau khi gửi email thành công
                ViewBag.EmailSent = "The reset link has been sent to your email.";
                return View();
            }

            // Nếu có lỗi
            return View(model);
        }


        [HttpGet]
        public async Task<IActionResult> ResetPassword(string email, string code, long? expiration)
        {
            var expirationTime = new DateTime(expiration.Value);
            if (string.IsNullOrEmpty(code) || expirationTime <= DateTime.UtcNow)
            {
                // Trả về thông báo lỗi nếu mã xác nhận không hợp lệ hoặc đã hết hạn
                string nameTokenUser = "PasswordConfirmationToken";

                var user = await _userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, "Invalid");
                }

                ViewBag.Message = "Invalid or expired password reset token.";
                return View("ForgotPassword");
            }

            // Giải mã mã xác nhận về dạng ban đầu và gán vào modelView
            var model = new ResetPasswordViewModel
            {
                Email = email,
                Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code))
            };

            return View(model);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();

                var errorMessage = string.Join(", ", errors);
                ModelState.AddModelError(string.Empty, errorMessage);
                return View(model);
            }

            var user = await _userManager.FindByEmailAsync(model.Email); // Tìm người dùng theo email

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, $"Can not find User - email: {model.Email}");
                return View(model);
            }

            // Đặt lại mật khẩu
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);

            if (result.Succeeded)
            {

                string nameTokenUser = "PasswordConfirmationToken";
                await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, "Invalid");

                // Thông báo Reset Password thành công
                TempData["SuccessMessage"] = "Reset Password Successfuly!";

                // Chuyển hướng đến trang đăng nhập
                return RedirectToAction("Login", "Account");
            }
            else
            {
                ModelState.AddModelError(string.Empty, $"Email: {model.Email} not match with email you requested to change!");
                return View(model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> EnableAuthenticator()
        {
            // Lấy thông tin người dùng hiện tại từ _userManager
            var user = await _userManager.GetUserAsync(User);

            // Đặt lại (reset) khóa Authenticator của người dùng
            // Việc này sẽ tạo ra một khóa mới, bắt buộc người dùng phải thiết lập lại ứng dụng Authenticator
            await _userManager.ResetAuthenticatorKeyAsync(user);

            // Lấy khóa Authenticator mới (sau khi reset) 
            // Khóa này chỉ có 1 sau khi đăng nhập thành công, dùng cho từng người dùng, mã này tồn tại trong 1 time và tự reset lại.
            // Khóa này sẽ được cung cấp cho người dùng để họ thiết lập ứng dụng Authenticator ( GoogleAuthenicator or Micsoft )
            var token = await _userManager.GetAuthenticatorKeyAsync(user);


            string authenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";
            string authUri = string.Format(authenticatorUriFormat, _urlEncoder.Encode("ICoder.VN"), _urlEncoder.Encode(user.Email), token);


            // Tạo mô hình ViewModel với khóa Authenticator (Token) mới
            // Token này sẽ được sử dụng để hiển thị cho người dùng thiết lập ứng dụng Authenticator
            var model = new TwoFactorAuthenticationViewModel()
            {
                Token = token,  // Gán khóa mới vào thuộc tính Token của ViewModel
                QRCodeUrl = authUri
            };

            // Trả về view cùng với mô hình (model) chứa khóa Authenticator mới
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize] // ~ Login trc
        public async Task<IActionResult> EnableAuthenticator(TwoFactorAuthenticationViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);
                var succeded = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, model.Code);

                Console.WriteLine(user.Email);
                Console.WriteLine(model.Code);

                if (succeded)
                {
                    await _userManager.SetTwoFactorEnabledAsync(user, true);
                }
                else
                {
                    ModelState.AddModelError("Verify", "Your two factor auth code not validated.");
                    return View(model);
                }

                return RedirectToAction(nameof(AuthenicatorConfirmation));
            }

            ModelState.AddModelError("Error", "Errorrrr");
            return View("Error");
        }

        [HttpGet]
        public async Task<IActionResult> AuthenicatorConfirmation()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> LoginVerifyAuthenicatorCode(bool rememberMe, string returnUrl = null)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

            if (user == null)
            {
                return View("Error");
            }

            ViewData["ReturnUrl"] = returnUrl;

            return View(new VerifyAuthenicatorViewModel { ReturnUrl = returnUrl, RememberMe = rememberMe });
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LoginVerifyAuthenicatorCode(VerifyAuthenicatorViewModel model)
        {
            model.ReturnUrl = model.ReturnUrl ?? Url.Content("~/");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                             .Select(e => e.ErrorMessage)
                                             .ToList();

                var errorMessage = string.Join(", ", errors);
                ModelState.AddModelError(string.Empty, errorMessage);
                return View(model);
            }

            var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(model.Code, model.RememberMe, rememberClient: false);

            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Home");
            }

            if (result.IsLockedOut)
            {
                Users user = null;

                user = await _userManager.FindByNameAsync(model.UserOrEmail);

                if (user == null)
                {
                    user = await _userManager.FindByEmailAsync(model.UserOrEmail);
                }

                await HandleLockedOutUser(user);

                return View(model);
            }

            ModelState.AddModelError(string.Empty, "Invalid Login Attemp.");
            return View(model);

        }

        [HttpGet]
        public async Task<IActionResult> RemoveAuthenicator()
        {
            var user = await _userManager.GetUserAsync(User);
            await _userManager.ResetAuthenticatorKeyAsync(user);
            await _userManager.SetTwoFactorEnabledAsync(user, false);
            return RedirectToAction("Index", "Home");
        }


        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            // Xóa cookie khi đăng xuất
            //Response.Cookies.Delete("Username");
            //Response.Cookies.Delete("Password");


            return RedirectToAction("Login", "Account");
        }
    }
}
