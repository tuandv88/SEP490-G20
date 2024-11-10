using AI.Application.Models.Messages.Dtos;

namespace AI.Application.Interfaces;
public interface IClientCommunicationService {
    //trả về solution và kết quả đã chạy code nếu có
    Task<MessageCodeDto> RequestUserCodeFromClient(string connectionId);
}

