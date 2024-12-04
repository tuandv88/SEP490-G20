using BuildingBlocks.Messaging.Events.Communities;
using Community.Domain.Enums;
using Community.Domain.ValueObjects;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Community.Application.Models.Discussions.EventHandlers.Integrations;
public record ContentModerationResultEventHandler(IDiscussionRepository discussionRepository, IFlagRepository flagRepository,
    ILogger<ContentModerationResultEventHandler> logger) : IConsumer<ContentModerationResultEvent> {
    public async Task Consume(ConsumeContext<ContentModerationResultEvent> context) {
        var message = context.Message;
        var discusstion = await discussionRepository.GetByIdAsync(message.DiscusstionId);
        if (discusstion == null) {
            logger.LogDebug($"[ContentModerationResultEventHandler] Discusstion is not found with discusstionId: {message.DiscusstionId}");
            return;
        }

        var isSafe = IsSafe(message.ViolationLevel);
        Flag? flag = null;
        //kiểm tra level có hợp lệ
        if (!Enum.TryParse(message.ViolationLevel, true, out ViolationLevel level)) {
            logger.LogDebug($"[ContentModerationResultEventHandler] ViolationLevel is not enum with value {message.ViolationLevel}");
            return;
        }

        //Change flag vào discusstion
        if (discusstion.FlagId != null) {
            flag = await flagRepository.GetByIdAsync(discusstion.FlagId.Value);
            if(flag == null) {
                logger.LogDebug($"[ContentModerationResultEventHandler] flag is not found with FlagId {discusstion.FlagId.Value}");
                return;
            }
            flag.Update(level, message.Reason, DateTime.UtcNow);
            await flagRepository.UpdateAsync(flag);
        } else {
            flag = Flag.Create(
            FlagId.Of(Guid.NewGuid()),
            discusstion.Id,
            level,
            message.Reason,
            DateTime.UtcNow
            );
            discusstion.FlagId = flag.Id;
            await flagRepository.AddAsync(flag);
        }
        //kiểm tra mức độ an toàn 
        if (isSafe) {
            // cho phép discusstion hiển thị ở trang công khai
            discusstion.UpdateStatus(true);
        } else {
            //Trạng thái không an toàn (nội dung không phù hợp)
            //gửi mail ở đây
            discusstion.UpdateStatus(false);
            var fullname = message.FullName;
            var email = message.Email;
        }
        await discussionRepository.UpdateAsync(discusstion);
        await discussionRepository.SaveChangesAsync();

    }

    private bool IsSafe(string violationLevel) {
        switch (violationLevel) {
            case nameof(ViolationLevel.None):
            case nameof(ViolationLevel.Low):
                return true;
            default:
                return false;
        }
    }
}

