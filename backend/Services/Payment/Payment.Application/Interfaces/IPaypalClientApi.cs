using Microsoft.AspNetCore.Http;

namespace Payment.Application.Interfaces;
public interface IPaypalClientApi {
    Task<bool> VerifyEvent(IHeaderDictionary headerDictionary, string body);
}

