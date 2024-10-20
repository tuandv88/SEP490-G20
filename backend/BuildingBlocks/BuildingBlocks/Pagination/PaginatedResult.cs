namespace BuildingBlocks.Pagination;
public class PaginatedResult<TEntity>
    (int pageIndex, int pageSize, long count, List<TEntity> data) 
    where TEntity : class
{
    public int PageIndex { get; } = pageIndex;
    public int PageSize { get; } = pageSize;
    public long Count { get; } = count;
    public List<TEntity> Data { get; } = data;
}
