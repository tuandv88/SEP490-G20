using BuildingBlocks.Email.Constants;
using BuildingBlocks.Email.Helpers;
using BuildingBlocks.Email.Interfaces;
using BuildingBlocks.Email.Models;
using BuildingBlocks.Messaging.Events.Communities;
using Community.Domain.Enums;
using Community.Domain.Models;
using Community.Domain.ValueObjects;
using MassTransit;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Web;

namespace Community.Application.Models.Discussions.EventHandlers.Integrations;
public record ContentModerationResultEventHandler(IDiscussionRepository discussionRepository, IFlagRepository flagRepository,
    ILogger<ContentModerationResultEventHandler> logger, IEmailService emailService, IConfiguration configuration) : IConsumer<ContentModerationResultEvent> {
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
            discusstion.UpdateStatus(false);

            await SendFlaggedEmailAsync(message, discusstion, flag);
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

    private string SafeSubstring(string input, int maxLength)
    {
        if (string.IsNullOrEmpty(input)) return input;

        // Sử dụng StringBuilder để xử lý chuỗi hiệu quả hơn
        var sb = new StringBuilder();
        int length = 0;
        foreach (char c in input)
        {
            if (length >= maxLength) break;
            sb.Append(c);
            length += Char.IsSurrogate(c) ? 0 : 1;
        }

        string result = sb.ToString();
        return result.Length == input.Length ? result : result.TrimEnd() + "...";
    }

    private async Task SendFlaggedEmailAsync(ContentModerationResultEvent message, Discussion discusstion, Flag flag)
    {
        try
        {

            var urlCallBack = configuration["SendMailExtensions:urlCallBackFlag"] + "discussion/" + discusstion.Id.Value;

            var fullname = HttpUtility.HtmlEncode(message.FullName);
            var email = message.Email;

            var discussionTitle = HttpUtility.HtmlEncode(SafeSubstring(discusstion.Title, 50));
            var discussionDescription = HttpUtility.HtmlEncode(SafeSubstring(discusstion.Description, 50));

            var violationFlag = flag.ViolationLevel.ToString().ToLower() + "-violation";
            var flagReason = HttpUtility.HtmlEncode(SafeSubstring(flag.Reason, 50));

            var flagDate = flag.FlaggedDate.ToString("yyyy-MM-dd HH:mm:ss");
            var flagLevel = flag.ViolationLevel.ToString();

            var emailBody = EmailHtmlTemplates.DiscussionFlaggedTemplate(
                fullname,
                discussionTitle,
                discussionDescription,
                flagDate,
                flagLevel,
                violationFlag,
                flagReason,
                urlCallBack
            );

            var emailMetadata = new EmailMetadata(
                toAddress: email,
                subject: "Notifications have flagged your post.",
                body: emailBody
            );

            await emailService.SendEmailAndSaveAsync(emailMetadata, EmailtypeConstant.NOTIFICATION);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }

}

