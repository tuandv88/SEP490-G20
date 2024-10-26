using BuidingBlocks.Storage.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Interfaces {
    public interface IFilesService {
        Task<string> UploadFileAsync(IFormFile file, string bucketName, string? prefix = null);
        Task<IEnumerable<S3ObjectDto>> GetAllFileAsync(string bucketName, string? prefix, int expiryMinutes = 1);
        Task<Stream> GetFileBykeyAsync(string bucketName, string key);
        Task<S3ObjectDto> GetFileAsync(string bucketName, string filePath, int expiryMinutes = 1);
        Task<string> UploadFileAsync(MemoryStream memoryStream, string originFileName, string contentType, string bucketName, string? prefix = null);
    }
}
