using Amazon;
using Amazon.S3;
using BuidingBlocks.Storage.Interfaces;
using BuidingBlocks.Storage.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage
{
    public static class Extensions
    {
        public static void AddStorage(this IServiceCollection services, IConfiguration configuration)
        {
            var accessKey = configuration["AWS:AccessKey"];
            var secretKey = configuration["AWS:SecretKey"];
            var url = configuration["AWS:Url"];
          
            AmazonS3Config config = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.APNortheast1,
                ServiceURL = "https://contabostorage.com/icoder"
            };

            AmazonS3Client s3Client = new AmazonS3Client(
                accessKey,
                secretKey,
                config
            );
            services.AddScoped<IBucketService, BucketService>();
            services.AddScoped<IFilesService,FilesServices>();
            services.AddSingleton<IAmazonS3>(s3Client);
        }

    }
}
