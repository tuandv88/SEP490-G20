using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using BuidingBlocks.Storage.Interfaces;
using BuidingBlocks.Storage.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Services
{
    public class FilesServices : IFilesService
    {
        private readonly IAmazonS3 _s3Client;

        public FilesServices(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task UploadFileAsync(IFormFile file, string bucketName, string? prefix = null)
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) throw new InvalidOperationException($"Bucket '{bucketName}' does not  exists.");
            var request = new PutObjectRequest()
            {
                BucketName = bucketName,
                Key = String.IsNullOrEmpty(prefix) ? file.FileName : $"{prefix?.TrimEnd('/')}/{file.FileName}",
                InputStream = file.OpenReadStream()
            };
            request.Metadata.Add("Content-type",file.ContentType);
            await _s3Client.PutObjectAsync(request);
        }
        public async Task<IEnumerable<S3ObjectDto>> GetAllFileAsync(string bucketName ,string? prefix)
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async( _s3Client, bucketName);
            if (!bucketExists) throw new InvalidOperationException($"Bucket '{bucketName}' does not  exists.");
            var request = new ListObjectsV2Request
            {
                BucketName = bucketName,
                Prefix = prefix
            };
            var result = await _s3Client.ListObjectsV2Async(request);
            var s3Objects = result.S3Objects.Select(s =>
            {
                var urlRequest = new GetPreSignedUrlRequest() { 
                BucketName = bucketName,
                Key = s.Key,
                Expires = DateTime.UtcNow.AddMinutes(1)
                };
                return new S3ObjectDto
                {
                    Name = s.Key.ToString(),
                    PresignedUrl = _s3Client.GetPreSignedURL(urlRequest),
                };
            });
            return s3Objects;
        }
        public async Task<Stream> GetFileBykeyAsync (string bucketName, string key)
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) throw new InvalidOperationException($"Bucket '{bucketName}' does not  exists.");
            var s3Object = await _s3Client.GetObjectAsync(bucketName, key);
            // return File(s3Object.ResponseStream,s3Object.Headers.ContentType);
            return s3Object.ResponseStream;
        }

    }
}
