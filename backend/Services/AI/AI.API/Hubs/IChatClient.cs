using AI.Application.Models.Messages.Dtos;

namespace AI.API.Hubs;
public interface IChatClient {
    Task<MessageCodeDto> RequestUserCode();
}

