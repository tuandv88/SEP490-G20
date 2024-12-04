namespace BuildingBlocks.Messaging.Events.Communitiesp;
public record ContentModerationRequestEvent : IntegrationEvent {
    public Guid DiscussionId { get; set; } = default!;
    public Guid UserId { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string CategoryName { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Tags { get; set; } = default!;
    public string? ImageUrl {  get; set; } = default!;
}
