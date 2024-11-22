using AuthServer.Dtos;
using AuthServer.Models;
using AuthServer.Repository.Services.Base64Converter;
using BuidingBlocks.Storage;
using BuidingBlocks.Storage.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;
        private readonly IFilesService _filesService;
        private readonly IBase64Converter _base64Converter;

        public ProfilesController(UserManager<Users> userManager, IBase64Converter base64Converter, IFilesService filesService)
        {
            _userManager = userManager;
            _filesService = filesService;
            _base64Converter = base64Converter;
        }

        [HttpPut("updateprofileimage")]
        public async Task<IActionResult> UpdateProfileImage([FromBody] UpdateProfileImageDto updateProfileImageDto)
        {
            var userCurrent = await _userManager.FindByIdAsync(updateProfileImageDto.UserId.ToString());

            if (userCurrent == null) 
            {
                return BadRequest($"Can not find user!");
            }

            var bucket = StorageConstants.BUCKET;
            var prefix = StorageConstants.IMAGE_IDENTITY_PATH;
            var originFileName = updateProfileImageDto.FileName;
            var base64Image = updateProfileImageDto.Base64Image;
            var contentType = updateProfileImageDto.ContentType;

            var fileName = await _filesService.UploadFileAsync(_base64Converter.ConvertToMemoryStream(base64Image), originFileName, contentType, bucket, prefix);

            var profileUrlImageNew = $"{prefix}/{fileName}";
            var profileUrlImageOld = userCurrent.ProfilePicture;

            userCurrent.ProfilePicture = profileUrlImageNew;

            await _filesService.DeleteFileAsync(bucket, profileUrlImageOld);

            var s3Object = await _filesService.GetFileAsync(bucket, profileUrlImageNew, 60);
            var urlProfileImagePresigned = s3Object.PresignedUrl;

            var result = await _userManager.UpdateAsync(userCurrent);

            if (result.Succeeded)
            {
                return Ok($"Update Successfully - urlAvatar: {urlProfileImagePresigned}" );
            }
            else
            {
                return BadRequest("Update Failed!");
            }
        }
    }
}
