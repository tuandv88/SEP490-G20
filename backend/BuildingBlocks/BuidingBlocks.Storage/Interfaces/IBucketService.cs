using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Interfaces
{
    public interface IBucketService
    {
        Task CreateBucketAsync(string bucketName);
        Task<IEnumerable<string>> GetAllBuketAsync();
        Task DeleteBucketAsync(String BucketName);
    }
}
