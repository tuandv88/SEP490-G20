namespace Community.Domain.Models;

public class Flag : Aggregate<FlagId>
{
    public DiscussionId DiscussionId { get; set; } = default!; // ID của thảo luận bị báo cáo
    public ViolationLevel ViolationLevel { get; set; } = ViolationLevel.None;
    public string Reason { get; set; } = string.Empty;
    public DateTime FlaggedDate { get; set; }

    public static Flag Create(FlagId id, DiscussionId discussionId, ViolationLevel violationLevel, string reason, DateTime flaggedDate)
    {
        return new Flag()
        {
            Id = id,
            DiscussionId = discussionId,
            Reason = reason,
            ViolationLevel = violationLevel,
            FlaggedDate = flaggedDate
        };
    }

    public void Update(ViolationLevel violationLevel, string reason, DateTime flaggedDate)
    {
        ViolationLevel = violationLevel;
        Reason = reason;
        FlaggedDate = flaggedDate;
    }
}

