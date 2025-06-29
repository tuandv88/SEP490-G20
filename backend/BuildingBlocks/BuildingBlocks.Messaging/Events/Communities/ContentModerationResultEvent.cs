﻿namespace BuildingBlocks.Messaging.Events.Communities;
public record ContentModerationResultEvent : IntegrationEvent {
    public Guid DiscusstionId { get; set; }
    public string FullName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string ViolationLevel { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
