using Amazon.S3;
using Amazon.S3.Util;
using BuidingBlocks.Storage.Interfaces;
using System;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Services
{
    public class BucketService : IBucketService
    {
        private readonly IAmazonS3 _s3Client;

        public BucketService(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task CreateBucketAsync(string bucketName)
        {
            var bucketExists = await AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, bucketName);
            if (bucketExists)
            {
                throw new InvalidOperationException($"Bucket '{bucketName}' already exists.");
            }

            await _s3Client.PutBucketAsync(bucketName);
        }
        public async Task<IEnumerable<string>> GetAllBuketAsync()
        {
            var data = await _s3Client.ListBucketsAsync();
            var buckets = data.Buckets.Select(b => { return b.BucketName; });
            return buckets;
        }
        public async Task DeleteBucketAsync(String BucketName)
        {
            await _s3Client.DeleteBucketAsync(BucketName);
        }

    }
}
