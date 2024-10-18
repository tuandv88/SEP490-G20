using BuidingBlocks.Storage.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Interfaces
{
    public interface IFilesService
    {
        Task UploadFileAsync(IFormFile file, string bucketName, string? prefix = null);
        Task<IEnumerable<S3ObjectDto>> GetAllFileAsync(string bucketName, string? prefix);
        Task<Stream> GetFileBykeyAsync(string bucketName, string key);
    }
}
