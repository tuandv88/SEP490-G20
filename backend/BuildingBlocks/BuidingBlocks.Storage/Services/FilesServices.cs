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

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName, string? prefix = null) {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) {
                throw new InvalidOperationException($"Bucket '{bucketName}' does not exist.");
            }
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}"; 

            var request = new PutObjectRequest() {
                BucketName = bucketName,
                Key = String.IsNullOrEmpty(prefix) ? fileName : $"{prefix?.TrimEnd('/')}/{fileName}",
                InputStream = file.OpenReadStream()
            };
            request.Metadata.Add("Content-type", file.ContentType);
            await _s3Client.PutObjectAsync(request);

            return fileName;
        }
        public async Task<string> UploadFileAsync(MemoryStream memoryStream, string originFileName, string contentType, string bucketName, string? prefix = null) {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) {
                throw new InvalidOperationException($"Bucket '{bucketName}' does not exist.");
            }
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(originFileName)}";

            var request = new PutObjectRequest() {
                BucketName = bucketName,
                Key = String.IsNullOrEmpty(prefix) ? fileName : $"{prefix?.TrimEnd('/')}/{fileName}",
                InputStream = memoryStream
            };
            request.Metadata.Add("Content-type", contentType);
            await _s3Client.PutObjectAsync(request);

            return fileName;
        }
        public async Task<IEnumerable<S3ObjectDto>> GetAllFileAsync(string bucketName, string? prefix, int expiryMinutes = 1) {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) {
                throw new InvalidOperationException($"Bucket '{bucketName}' does not exist.");
            }
            var request = new ListObjectsV2Request {
                BucketName = bucketName,
                Prefix = prefix
            };
            var result = await _s3Client.ListObjectsV2Async(request);
            var s3Objects = result.S3Objects.Select(s =>
            {
                var urlRequest = new GetPreSignedUrlRequest {
                    BucketName = bucketName,
                    Key = s.Key,
                    Expires = DateTime.UtcNow.AddMinutes(expiryMinutes)
                };

                return new S3ObjectDto {
                    Name = s.Key.ToString(),
                    PresignedUrl = _s3Client.GetPreSignedURL(urlRequest),
                };
            });

            return s3Objects;
        }
        public async Task<S3ObjectDto> GetFileAsync(string bucketName, string filePath, int expiryMinutes = 1) {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (!bucketExists) {
                throw new InvalidOperationException($"Bucket '{bucketName}' does not exist.");
            }
            var request = new GetObjectMetadataRequest {
                BucketName = bucketName,
                Key = filePath
            };

            try {
                var metadata = await _s3Client.GetObjectMetadataAsync(request);
                var urlRequest = new GetPreSignedUrlRequest {
                    BucketName = bucketName,
                    Key = filePath,
                    Expires = DateTime.UtcNow.AddMinutes(expiryMinutes)
                };

                return new S3ObjectDto {
                    Name = filePath, 
                    PresignedUrl = _s3Client.GetPreSignedURL(urlRequest),
                };
            } catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) {
                throw new FileNotFoundException($"File '{filePath}' does not exist in bucket '{bucketName}'.");
            }
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
