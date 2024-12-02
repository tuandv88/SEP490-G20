namespace Community.Domain.Models;

public class Flag : Aggregate<FlagId>
{
    public DiscussionId DiscussionId { get; set; } = default!; // ID của thảo luận bị báo cáo

    public ViolationLevel ViolationLevel { get; set; }

    public string? Reason { get; set; }

    public DateTime FlaggedDate { get; set; }
}

