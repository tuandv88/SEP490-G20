using User.Domain.Abstractions;

namespace user.Domain.Abstractions;
public abstract class FileEntity<TId> : Entity<TId>
{
    public bool IsActive { get; set; }
    public string FileName { get; set; } = default!;
    public string Url { get; set; } = default!;
    public string Format { get; set; } = default!;
    public double FileSize { get; set; }
}

