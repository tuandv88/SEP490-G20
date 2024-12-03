using BuildingBlocks.Messaging.Events.Communitiesp;
using Community.Domain.Events;
using MassTransit;
using MediatR;
using Newtonsoft.Json;

namespace Community.Application.Models.Discussions.EventHandlers.Domains;
public class DiscussionChangedEventHandler(IPublishEndpoint publishEndpoint, ICategoryRepository categoryRepository) : INotificationHandler<DiscussionChangedEvent> {
    public async Task Handle(DiscussionChangedEvent notification, CancellationToken cancellationToken) {
        var discussion = notification.Discussion;
        var category = await categoryRepository.GetByIdAsync(discussion.CategoryId.Value);
        if (category == null) {
            throw new NotFoundException(nameof(Category), discussion.CategoryId.Value);
        }
        await publishEndpoint.Publish(new ContentModerationRequestEvent() {
            DiscussionId = discussion.Id.Value,
            UserId = discussion.UserId.Value,
            CategoryName = category.Name,
            Title = discussion.Title,
            Description = discussion.Description,
            Tags = JsonConvert.SerializeObject(discussion.Tags),
            ImageUrl = discussion.ImageUrl
        }, cancellationToken);
    }
}

