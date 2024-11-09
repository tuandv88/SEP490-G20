using AuthServer.Models.AccountViewModel;
using AuthServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using AuthServer.Models.ProfileViewModel;
using IdentityServer4.Services;
using Microsoft.AspNetCore.DataProtection;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authorization;

namespace AuthServer.Controllers
{
    [Authorize]
    public class ProfileController : Controller
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly UrlEncoder _urlEncoder;
        public IActionResult Index()
        {
            return View();
        }
        public ProfileController(SignInManager<Users> signInManager, UserManager<Users> userManagerr, UrlEncoder urlEncoder)
        {

            _signInManager = signInManager;
            _userManager = userManagerr;
            _urlEncoder = urlEncoder;
        }

        [HttpGet]
        public async Task<IActionResult> Personal(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            ViewData["ReturnUrl"] = returnUrl;

            var userCurrent = await _userManager.GetUserAsync(User); // Đợi kết quả trả về
            if (userCurrent != null)
            {
                PersonalViewModel model = new PersonalViewModel()
                {
                    UserName = userCurrent.UserName,
                    FirstName = userCurrent.FirstName,
                    LastName = userCurrent.LastName,
                    Dob = userCurrent.DateOfBirth
                };

                return View(model);
            }

            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Personal(PersonalViewModel model, string returnUrl = null)
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

            // Lấy thông tin người dùng hiện tại
            var userCurrent = await _userManager.GetUserAsync(User);
            if (userCurrent != null)
            {
                // Cập nhật thông tin từ model vào người dùng
                userCurrent.FirstName = model.FirstName;
                userCurrent.LastName = model.LastName;
                userCurrent.DateOfBirth = model.Dob;

                // Lưu các thay đổi vào cơ sở dữ liệu
                var result = await _userManager.UpdateAsync(userCurrent);

                // Kiểm tra kết quả lưu
                if (result.Succeeded)
                {
                    TempData["SuccessMessageProfile"] = "Profile updated successfully.";
                    return RedirectToAction("Index", "Profile");
                }
                else
                {
                    TempData["ErrorMessageProfile"] = "Update Failed!";
                    // Nếu không thành công, thêm lỗi vào ModelState
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            return View(model);
        }


        [HttpGet]
        public async Task<IActionResult> Emails()
        {
            var currentUser = await _userManager.GetUserAsync(User); // Lấy thông tin người dùng

            // Kiểm tra xem email đã được xác minh chưa
            bool isEmailVerified = await _userManager.IsEmailConfirmedAsync(currentUser);

            // Tạo ViewModel để gửi đến View
            var viewModel = new EmailViewModel
            {
                CurrentEmail = currentUser.Email,  // Email hiện tại
                IsVerified = isEmailVerified // Kiểm tra email đã được xác minh
            };
            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddEmail(EmailViewModel model)
        {
            return View();
        }

        [HttpGet]
        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateContact(EmailViewModel model)
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ChangePassword(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            ViewData["ReturnUrl"] = returnUrl;

            var userCurrent = await _userManager.GetUserAsync(User);
            if (userCurrent != null)
            {
                ChangePasswordViewModel model = new ChangePasswordViewModel()
                {
                    UserName = userCurrent.UserName
                };

                return View(model);
            }

            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model, string returnUrl = null)
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

            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, $"Can not find User: {model.UserName}");
                return View(model);
            }

            // Kiểm tra nếu mật khẩu hiện tại trùng với mật khẩu lưu trong cơ sở dữ liệu
            var currentPasswordMatch = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
            if (!currentPasswordMatch)
            {
                ModelState.AddModelError(string.Empty, "Current password is incorrect.");
                return View(model);
            }

            // Đặt lại mật khẩu
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (result.Succeeded)
            {
                string nameTokenUser = "PasswordConfirmationToken";
                await _userManager.SetAuthenticationTokenAsync(user, "Default", nameTokenUser, "Invalid");

                // Thông báo Change Password thành công
                TempData["SuccessMessageProfile"] = "Change Password Successfully!";

                return RedirectToAction("Index", "Profile");
            }
            else
            {
                ModelState.AddModelError(string.Empty, $"Change Password Failed");
                return View(model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> TwoFactorAuthManager()
        {
            var currentUser = await _userManager.GetUserAsync(User); // Lấy thông tin người dùng

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                ViewData["TwoFactorAuthEnabled"] = false;
            }
            else
            {
                ViewData["TwoFactorAuthEnabled"] = user.TwoFactorEnabled;
            }

            return View();
        }


        [HttpGet]
        public async Task<IActionResult> EnableTwoFactorAuth()
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
            string authUri = string.Format(authenticatorUriFormat, _urlEncoder.Encode("ICoder.vn"), _urlEncoder.Encode(user.Email), token);


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
        public async Task<IActionResult> EnableTwoFactorAuth(TwoFactorAuthenticationViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);
                var succeded = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, model.Code);
                if (succeded)
                {
                    await _userManager.SetTwoFactorEnabledAsync(user, true);
                    TempData["SuccessMessageProfile"] = "Turn-on Two-Factor Auth Successfully!";
                    return RedirectToAction("Index", "Profile");
                }
                else
                {
                    TempData["ErrorMessageEnableTwoFactor"] = "Your two factor auth code not validated.\nPlease try again QR or Code";
                    return RedirectToAction("EnableTwoFactorAuth", "Profile");
                }
            }

            TempData["ErrorMessageEnableTwoFactor"] = "An error occurred. Please try again.";
            return RedirectToAction("EnableTwoFactorAuth", "Profile");
        }


        [HttpGet]
        public async Task<IActionResult> RemoveAuthenicator()
        {
            var user = await _userManager.GetUserAsync(User);
            await _userManager.ResetAuthenticatorKeyAsync(user);
            await _userManager.SetTwoFactorEnabledAsync(user, false);
            TempData["SuccessMessageProfile"] = "Turn-off Two-Factor Auth Successfully!";
            return RedirectToAction("Index", "Profile");
        }
    }
}
