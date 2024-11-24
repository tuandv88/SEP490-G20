using AuthServer.Dtos.Users;
using AuthServer.Extensions;
using AuthServer.Models;
using AuthServer.Models.ProfileViewModel;
using AuthServer.Repository.Services.Base64Converter;
using BuidingBlocks.Storage;
using BuidingBlocks.Storage.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace AuthServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;
        private readonly IFilesService _filesService;
        private readonly IBase64Converter _base64Converter;

        public UsersController(UserManager<Users> userManager, IBase64Converter base64Converter, IFilesService filesService)
        {
            _userManager = userManager;
            _filesService = filesService;
            _base64Converter = base64Converter;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound(new { message = "No users found." });
            }

            // Sử dụng phương thức mở rộng để chuyển đổi danh sách Users thành danh sách UserDto
            var userDtos = await users.ToUserDtoListAsync(_filesService, _userManager);

            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new { message = "UserId cannot be empty." });
            }

            // Lấy thông tin người dùng từ UserManager
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = $"No user found with ID {id}." });
            }

            // Lấy danh sách vai trò
            var roles = await _userManager.GetRolesAsync(user);

            // Lấy URL ảnh đại diện
            var imageUrl = await _filesService.GetFileAsync(StorageConstants.BUCKET, user.ProfilePicture, 60);

            // Chuyển đổi thành UserDto
            var userDto = user.ToUserDto(imageUrl.PresignedUrl!, roles.ToList());

            return Ok(userDto);
        }


        [HttpPost("getusers")]
        public async Task<IActionResult> GetUsersByIds([FromBody] UserIdsDto userIdsDtos)
        {
            if (userIdsDtos == null || userIdsDtos.UserIds == null || !userIdsDtos.UserIds.Any())
            {
                return BadRequest(new { message = "UserIds cannot be blank." });
            }

            // Giới hạn số lượng UserIds để tránh truy vấn quá nhiều
            if (userIdsDtos.UserIds.Count > 100)
            {
                return BadRequest(new { message = "Do not exceed 100 UserIds in one request." });
            }

            // Lấy danh sách người dùng từ UserManager
            var users = await _userManager.Users
                .Where(u => userIdsDtos.UserIds.Contains(u.Id))
                .ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound(new { message = "No users were found with the provided UserIds." });
            }

            // Sử dụng phương thức mở rộng để chuyển đổi danh sách Users thành danh sách UserDto
            var userDtos = await users.ToUserDtoListAsync(_filesService, _userManager);

            return Ok(userDtos);
        }

        [HttpGet("{id}/image")]
        public async Task<IActionResult> GetUserImageById(Guid id)
        {
            var userCurrent = await _userManager.FindByIdAsync(id.ToString());

            if (userCurrent == null)
            {
                return BadRequest($"Can not find user!");
            }

            var bucket = StorageConstants.BUCKET;
            var s3Object = await _filesService.GetFileAsync(bucket, userCurrent.ProfilePicture, 60);
            var presignedUrl = s3Object.PresignedUrl!;

            return Ok(new { ImageUrlProfile = presignedUrl });
        }

        [HttpPut("updateimage")]
        public async Task<IActionResult> UpdateImage([FromBody] UpdateImageDto updateImageDto)
        {
            var userCurrent = await _userManager.FindByIdAsync(updateImageDto.UserId.ToString());

            if (userCurrent == null) 
            {
                return BadRequest($"Can not find user!");
            }

            var bucket = StorageConstants.BUCKET;
            var prefix = StorageConstants.IMAGE_IDENTITY_PATH;
            var originFileName = updateImageDto.FileName;
            var base64Image = updateImageDto.Base64Image;
            var contentType = updateImageDto.ContentType;

            var fileName = await _filesService.UploadFileAsync(_base64Converter.ConvertToMemoryStream(base64Image), originFileName, contentType, bucket, prefix);

            var profileUrlImageNew = $"{prefix}/{fileName}";
            var profileUrlImageOld = userCurrent.ProfilePicture;

            userCurrent.ProfilePicture = profileUrlImageNew;

            if(profileUrlImageOld != "backend/imageidentity/avatardefault.jpg")
            {
                await _filesService.DeleteFileAsync(bucket, profileUrlImageOld);
            }

            var s3Object = await _filesService.GetFileAsync(bucket, profileUrlImageNew, 60);
            var urlProfileImagePresigned = s3Object.PresignedUrl;

            var result = await _userManager.UpdateAsync(userCurrent);

            if (result.Succeeded)
            {
                return Ok($"Update Successfully - urlUserImage: {urlProfileImagePresigned}" );
            }
            else
            {
                return BadRequest("Update Failed!");
            }
        }

        [HttpPut("updateissurvey")]
        public async Task<IActionResult> UpdateSurveyStatus([FromBody] UpdateSurveyStatusDto updateSurveyStatusDto)
        {
            if (updateSurveyStatusDto.UserId == Guid.Empty)
            {
                return BadRequest(new { message = "Invalid userId." });
            }

            // Tìm người dùng theo ID
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == updateSurveyStatusDto.UserId);

            if (user == null)
            {
                return NotFound(new { message = "User not found!" });
            }

            // Lấy danh sách claims hiện tại của người dùng
            var existingClaims = await _userManager.GetClaimsAsync(user);
            var isSurveyClaim = existingClaims.FirstOrDefault(c => c.Type == "issurvey");

            if (isSurveyClaim != null)
            {
                await _userManager.RemoveClaimAsync(user, isSurveyClaim);
            }

            await _userManager.AddClaimAsync(user, new Claim("issurvey", "true"));

            return Ok(new { message = "Survey status updated successfully." });
        }

    }
}
