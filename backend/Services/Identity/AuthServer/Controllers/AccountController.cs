﻿using AuthServer.Models;
using AuthServer.Models.AccountViewModel;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Encodings.Web;
using System.Text;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using BuildingBlocks.Email.Helpers;
using BuidingBlocks.Storage;
using BuildingBlocks.Email.Constants;
using Microsoft.AspNetCore.Http;

namespace AuthServer.Controllers
{
    public class AccountController : Controller
    {
        private readonly IIdentityServerInteractionService _interactionService;
        // Là 1 services trong identityserver4 dùng để: Quản lí thông tin xác thực giữa client và identityServer và các hành động để 2 bên tương tác qua lại.
        // Thông tin: đăng nhập, xác thực, và các hành động trong giao diện người dùng.
        // Quản lí: Quản lý yêu cầu xác thực và authorization,
        //          Xác định và xử lý thông tin đăng nhập.
        //          Hỗ trợ logic xác thực theo OpenID Connect (OIDC)
        //          Giao diện giữa server và client: Đảm bảo tương tác hợp lý giữa server và các yêu cầu của client.

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
            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["ReturnUrl"] = returnUrl;

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                var user = new Users
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    DateOfBirth = model.Dob,
                    ProfilePicture = StorageConstants.IMAGE_IDENTITY_PATH + "/avatardefault.jpg",
                    Bio = string.Empty,
                    Address = string.Empty,
                };

                if (model.ExternalLogin)
                {
                    // Lấy email gốc từ TempData 
                    var emailFromGoogle = HttpContext.Session.GetString("GoogleEmail");

                    // Kiểm tra nếu email trên form khác với email gốc từ Google
                    if (!String.IsNullOrEmpty(emailFromGoogle) && model.Email != emailFromGoogle)
                    {
                        // Nếu email đã thay đổi, yêu cầu xác thực lại email
                        ModelState.AddModelError("Email", "You have changed your email. Please verify again.");
                        return View(model);
                    }
                }

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // Add Role Default
                    string defaultRole = "learner";
                    var roleResult = await _userManager.AddToRoleAsync(user, defaultRole);

                    Console.WriteLine("User created a new account with password.");
                    if (model.ExternalLogin)
                    {
                        var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        await _userManager.ConfirmEmailAsync(user, emailConfirmationToken);
                        await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", "InvalidToken");

                        var info = await _signInManager.GetExternalLoginInfoAsync();
                        await _userManager.AddLoginAsync(user, info);

                        HttpContext.Session.Remove("GoogleEmail");

                        // Đăng nhập ngay mà không cần xác nhận email
                        await _signInManager.SignInAsync(user, isPersistent: false);



                        return RedirectToAction("Index", "Profile");
                    }
                    else
                    {
                        var userId = await _userManager.GetUserIdAsync(user);

                        // Tạo mới Token
                        string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                        // Đặt thời gian hết hạn mới (ví dụ 5 phút sau)
                        DateTime newExpirationTime = DateTime.UtcNow.AddMinutes(30);

                        // Lưu token mới vào cơ sở dữ liệu
                        await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", $"{code}|{newExpirationTime.Ticks}");

                        // Mã hóa token 
                        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                        string fullName = model.FirstName + " " + model.LastName;

                        var callbackUrl = Url.Action(
                            action: "ConfirmEmail",
                            controller: "Account",
                            values: new { userId = userId, code = code, expiration = newExpirationTime.Ticks, returnUrl = returnUrl },
                            protocol: Request.Scheme);

                        var emailBody = EmailHtmlTemplates.ConfirmEmailTemplate(fullName, callbackUrl);

                        var emailMetadata = new EmailMetadata(
                            toAddress: model.Email,
                            subject: "Confirm your email",
                            body: emailBody
                        );

                        //await _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY);
                        Task.Run(() => _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY));

                        TempData["ConfirmEmailSuccessMessage"] = "Registration successful! Please check your email and confirm your account.";

                        // Chuyển hướng đến trang thông báo thành công
                        return RedirectToAction("RegistrationConfirmation", "Account", new { fullName = $"{model.FirstName} {model.LastName}", email = model.Email });

                        //return RedirectToAction("Login", "Account");
                    }
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
            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["ReturnUrl"] = returnUrl;

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
                return RedirectToAction("Index", "Account");
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
                Console.WriteLine("User is already authenticated. Redirecting to Profile Index.");
                return RedirectToAction("Index", "Profile");
            }

            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["ReturnUrl"] = returnUrl;

            // Log thông tin về returnUrl
            Console.WriteLine($"Return URL: {returnUrl}");

            // Kiểm tra cookie và tự động điền thông tin đăng nhập
            var username = Request.Cookies["Username"];
            var encryptedPassword = Request.Cookies["Password"];

            Console.WriteLine($"Cookie Username: {username}");
            Console.WriteLine($"Cookie Password (Encrypted): {encryptedPassword}");

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(encryptedPassword))
            {
                // Giải mã mật khẩu
                var decryptedPassword = await Task.Run(() => _protector.Unprotect(encryptedPassword));

                // Log thông tin đã giải mã mật khẩu
                Console.WriteLine($"Decrypted Password: {decryptedPassword}");

                var model = new LoginViewModel
                {
                    UsernameOrEmail = username,
                    Password = decryptedPassword,
                    RememberMe = true
                };

                // Log thông tin model được tạo
                Console.WriteLine($"LoginViewModel created: UsernameOrEmail = {model.UsernameOrEmail}, RememberMe = {model.RememberMe}");

                return View(model);
            }

            // Log khi không có cookie
            Console.WriteLine("No username or password found in cookies.");

            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            // Log thông tin returnUrl
            Console.WriteLine($"Return Url: {returnUrl}");

            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["ReturnUrl"] = returnUrl;

            if (!ModelState.IsValid)
            {
                // Log nếu ModelState không hợp lệ
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();

                var errorMessage = string.Join(", ", errors);
                ModelState.AddModelError(string.Empty, errorMessage);

                Console.WriteLine($"ModelState is invalid: {errorMessage}");

                return View(model);
            }

            Users user = null;

            // Tìm người dùng theo tên hoặc email
            user = await _userManager.FindByNameAsync(model.UsernameOrEmail);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(model.UsernameOrEmail);
            }

            // Ghi log khi bắt đầu đăng nhập
            Console.WriteLine($"Attempting to sign in with username/email: {model.UsernameOrEmail}");

            var result = await _signInManager.PasswordSignInAsync(model.UsernameOrEmail, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                // Nếu đăng nhập thất bại, thử lại với tên người dùng khác
                if (user != null)
                {
                    result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: true);
                }
            }

            if (result.Succeeded)
            {
                // Log khi đăng nhập thành công
                Console.WriteLine("Login Successful");

                // Kiểm tra và thêm claims nếu cần
                var existingClaims = await _userManager.GetClaimsAsync(user);
                var isSurveyClaim = existingClaims.FirstOrDefault(c => c.Type == "issurvey");

                if (isSurveyClaim == null)
                {
                    await _userManager.AddClaimAsync(user, new Claim("issurvey", "false"));
                    Console.WriteLine("Added 'issurvey' claim for the user.");
                }

                // Xử lý cookies nếu người dùng chọn RememberMe
                if (model.RememberMe)
                {
                    var cookieOptions = new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(1),  // Cookie tồn tại trong 1 ngày
                        Secure = true,
                        HttpOnly = true                     // Bảo mật cho username
                    };

                    // Mã hóa mật khẩu và lưu vào cookies
                    var encryptedPassword = _protector.Protect(model.Password);
                    Response.Cookies.Append("Username", model.UsernameOrEmail, cookieOptions);
                    Response.Cookies.Append("Password", encryptedPassword, new CookieOptions
                    {
                        Expires = DateTime.Now.AddMinutes(30),
                        Secure = true,
                        HttpOnly = false                      // Không đặt HttpOnly để có thể tự động điền lại
                    });

                    Console.WriteLine("Stored Username and Encrypted Password in cookies.");
                }
                else
                {
                    // Xóa cookies nếu không chọn RememberMe
                    Response.Cookies.Delete("Username");
                    Response.Cookies.Delete("Password");
                    Console.WriteLine("Deleted Username and Password cookies.");
                }

                // Reset failed login attempts khi đăng nhập thành công
                if (user != null)
                {
                    await _userManager.ResetAccessFailedCountAsync(user);  // Reset số lần đăng nhập sai
                }

                if (_interactionService.IsValidReturnUrl(returnUrl))
                {
                    Console.WriteLine($"Redirecting to returnUrl: {returnUrl}");
                    return Redirect(returnUrl);
                }
                else
                {
                    Console.WriteLine($"Redirecting to Profile Index.");
                    return RedirectToAction("Index", "Profile");
                }
            }

            if (user != null)
            {
                var emailConfirmAccount = await _userManager.IsEmailConfirmedAsync(user);
                if (!emailConfirmAccount)
                {
                    await HandleEmailConfirmationAsync(user, returnUrl);

                    // Log khi yêu cầu xác minh email
                    Console.WriteLine("Email is not confirmed. Asking user to verify email.");
                    ModelState.AddModelError(string.Empty, "Check your email & verify your account!");
                    return View(model);
                }
            }

            if (result.RequiresTwoFactor)
            {
                if (user != null)
                {
                    // Log khi yêu cầu xác thực 2 yếu tố
                    Console.WriteLine("Two-factor authentication required.");
                    return RedirectToAction("LoginVerifyAuthenicatorCode", "Account", new { usernameOrEmail = user.Email, rememberMe = model.RememberMe, returnUrl = returnUrl });
                }
            }

            if (result.IsLockedOut)
            {
                // Log khi tài khoản bị khóa
                Console.WriteLine("Account is locked out.");
                await HandleLockedOutUser(user);
                return View(model);
            }

            // Log lỗi nếu thông tin người dùng không chính xác
            Console.WriteLine("Login failed. Incorrect username/email or password.");
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
                    newExpirationTime = DateTime.UtcNow.AddMinutes(30);

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
                newExpirationTime = DateTime.UtcNow.AddMinutes(30);

                // Lưu token mới vào cơ sở dữ liệu
                await _userManager.SetAuthenticationTokenAsync(user, "Default", "EmailConfirmationToken", $"{code}|{newExpirationTime.Ticks}");
            }

            // Mã hóa token
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var fullName = user.FirstName + " " + user.LastName;

            var callbackUrl = Url.Action(
                action: "ConfirmEmail",
                controller: "Account",
                values: new { userId = userId, code = code, expiration = newExpirationTime.Ticks, returnUrl = returnUrl },
                protocol: Request.Scheme);

            var emailBody = EmailHtmlTemplates.ConfirmEmailTemplate(fullName, callbackUrl);

            var emailMetadata = new EmailMetadata(
                toAddress: userEmail,
                subject: "Confirm your email",
                body: emailBody
            );

            // Gửi email xác nhận
            // await _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY);
            Task.Run(() => _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY));

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
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            if (string.IsNullOrEmpty(provider))
            {
                // Nếu provider rỗng, trả về thông báo lỗi
                TempData["ErrorMessage"] = "Provider is missing.";
                return RedirectToAction(nameof(Login));
            }

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
                // Người dùng chưa tồn tại, chuyển hướng đến trang đăng ký với thông tin từ ExternalLoginInfo
                var model = new RegisterViewModel
                {
                    Email = info.Principal.FindFirstValue(ClaimTypes.Email),
                    FirstName = info.Principal.FindFirstValue("given_name") ?? string.Empty,
                    LastName = info.Principal.FindFirstValue("family_name") ?? string.Empty,
                    Dob = DateTime.TryParse(info.Principal.FindFirstValue("birthdate"), out var birthDate) ? birthDate : DateTime.MinValue,
                    ExternalLogin = true  // Đánh dấu là đăng ký qua dịch vụ ngoài
                };

                var emailFromGoogle = info.Principal.FindFirstValue(ClaimTypes.Email);
                if (!String.IsNullOrEmpty(emailFromGoogle))
                {
                    HttpContext.Session.SetString("GoogleEmail", emailFromGoogle);
                }

                // Chuyển hướng đến trang Register để người dùng hoàn tất thông tin
                return View("Register", model);
            }
            else
            {
                // Đăng nhập người dùng
                var signInResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: false);

                if (signInResult.Succeeded)
                {

                    var existingClaims = await _userManager.GetClaimsAsync(user);
                    var isSurveyClaim = existingClaims.FirstOrDefault(c => c.Type == "issurvey");

                    if (isSurveyClaim == null)
                    {
                        await _userManager.AddClaimAsync(user, new Claim("issurvey", "false"));
                    }

                    Console.WriteLine(returnUrl);
                    if (_interactionService.IsValidReturnUrl(returnUrl))
                    {
                        Console.WriteLine($"Redirecting to returnUrl: {returnUrl}");
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        // Đăng nhập thành công, chuyển đến trang tiếp theo
                        Console.WriteLine($"Redirecting to Profile Index.");
                        return RedirectToAction("Index", "Profile");
                    }
                }
                else if (signInResult.RequiresTwoFactor)
                {
                    // Người dùng yêu cầu xác thực hai yếu tố (2FA)
                    return RedirectToAction("LoginVerifyAuthenicatorCode", "Account", new { usernameOrEmail = user.Email, rememberMe = false, returnUrl = returnUrl });
                }
                else if (signInResult.IsLockedOut)
                {
                    TempData["ErrorMessage"] = "Account is Locked!";
                    return RedirectToAction("Login", "Account");
                }
                else
                {
                    // Xử lý lỗi nếu đăng nhập thất bại vì lý do khác
                    TempData["ErrorMessage"] = "Login failed. Please try again.";
                    return RedirectToAction("Login", "Account");
                }
            }
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


                    return RedirectToAction("Index", "Account");
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
                            newExpirationTime = DateTime.UtcNow.AddMinutes(30);

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
                        newExpirationTime = DateTime.UtcNow.AddMinutes(30);

                        // Lưu token mới vào cơ sở dữ liệu
                        await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, $"{code}|{newExpirationTime.Ticks}");
                    }

                    // Mã hóa token
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

                    var fullName = user.FirstName + " " + user.LastName;

                    var callbackUrl = Url.Action(
                        action: "ResetPassword",
                        controller: "Account",
                        values: new { email = model.Email, code = code, expiration = newExpirationTime.Ticks },
                        protocol: Request.Scheme);

                    var emailBody = EmailHtmlTemplates.ResetPasswordTemplate(fullName, callbackUrl);

                    var emailMetadata = new EmailMetadata(
                        toAddress: model.Email,
                        subject: "Reset Password",
                        body: emailBody
                    );

                    // Gửi email xác nhận
                    // await _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY);
                    Task.Run(() => _emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.VERIFY));

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
        public async Task<IActionResult> LoginVerifyAuthenicatorCode(string usernameOrEmail = null, bool rememberMe = false, string returnUrl = null)
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

            if (user == null)
            {
                return View("Error");
            }

            Console.WriteLine(usernameOrEmail); 
            ViewData["ReturnUrl"] = returnUrl;

            return View(new VerifyAuthenicatorViewModel { UserOrEmail = usernameOrEmail, RememberMe = rememberMe , ReturnUrl = returnUrl});
        }


        [HttpPost]
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
                return RedirectToAction("Index", "Profile");
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

            ModelState.AddModelError(string.Empty, "Code Validated Invalid. Please try again.");
            return View(model);

        }


        [HttpGet]
        public async Task<IActionResult> Logout(string logoutId)
        {
            // Xóa session của người dùng tại server
            await _signInManager.SignOutAsync();

            // Lấy thông tin context logout từ IdentityServer
            var logoutContext = await _interactionService.GetLogoutContextAsync(logoutId);

            // Gọi front_channel_logout_uri nếu có
            //if (!string.IsNullOrEmpty(logoutContext?.SignOutIFrameUrl))
            //{
            //    // Trả về một View chứa iframe để gọi front_channel_logout_uri
            //    TempData["SignOutIFrameUrl"] = logoutContext.SignOutIFrameUrl;
            //    return RedirectToAction("LoggedOut", "Account"); // View này sẽ render iframe
            //}

            // Nếu có PostLogoutRedirectUri, redirect về client
            if (!string.IsNullOrEmpty(logoutContext?.PostLogoutRedirectUri))
            {
                return Redirect(logoutContext.PostLogoutRedirectUri);
            }

            // Nếu không có PostLogoutRedirectUri, về trang mặc định
            return RedirectToAction("Login", "Account");
        }

        [HttpGet]
        public async Task<IActionResult> AccessDenied()
        {
            // Hiển thị trang AccessDenied
            return View();
        }

    }
}
