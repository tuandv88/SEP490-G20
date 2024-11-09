using Microsoft.AspNetCore.Mvc;
using BuidingBlocks.Storage.Interfaces;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace User.API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase {
        private readonly IFilesService _filesService;

        public FileController(IFilesService filesService) {
            _filesService = filesService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string bucketName, [FromQuery] string? prefix = null) {
            if (file == null || file.Length == 0) {
                return BadRequest("No file selected for upload.");
            }

            try {
                await _filesService.UploadFileAsync(file, bucketName, prefix);
                return Ok("File uploaded successfully.");
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetFile([FromQuery] string bucketName, [FromQuery] string fileName) {
            if (string.IsNullOrWhiteSpace(fileName)) {
                return BadRequest("File name must be provided.");
            }

            try {
                var fileDto = await _filesService.GetFileAsync(bucketName, fileName);
                return Ok(fileDto); // Hoặc bạn có thể trả về URL ký tạm, tùy thuộc vào yêu cầu
            } catch (FileNotFoundException ex) {
                return NotFound(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // API để lấy tất cả file
        [HttpGet("list")]
        public async Task<IActionResult> GetAllFiles([FromQuery] string bucketName, [FromQuery] string? prefix = null) {
            if (string.IsNullOrWhiteSpace(bucketName)) {
                return BadRequest("Bucket name must be provided.");
            }

            try {
                var files = await _filesService.GetAllFileAsync(bucketName, prefix);
                return Ok(files);
            } catch (InvalidOperationException ex) {
                return NotFound(ex.Message);
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
