using Elastic.CommonSchema;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Payment.Application.Commons.Paypals.Models;
using System.Net.Http.Headers;
using System.Text;

namespace Payment.Infrastructure.Services;
public class PaypalClientApi : IPaypalClientApi {
    private readonly IConfiguration _configuration;
    private HttpClient _httpClient;
    public PaypalClientApi(IConfiguration configuration) {
        _configuration = configuration;
        CreateHttpClient();
    }
    private void CreateHttpClient() {
        _httpClient = new HttpClient();
    }

    public async Task<AuthorizationResponseData> GetAuthorizationRequest() {
        var baseUrl = _configuration["PayPal:BaseUrl"];
        var clientId = _configuration["PayPal:ClientId"];
        var clientSecret = _configuration["PayPal:ClientSecret"];
        EnsureHttpClientCreated();

        var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var keyValueParis = new List<KeyValuePair<string, string>>
            { new KeyValuePair<string, string>("grant_type", "client_credentials") };

        var response = await _httpClient.PostAsync($"{baseUrl}/v1/oauth2/token", new FormUrlEncodedContent(keyValueParis));

        var responseAsString = await response.Content.ReadAsStringAsync();

        var authorizationResponse = JsonConvert.DeserializeObject<AuthorizationResponseData>(responseAsString)!;

        return authorizationResponse;
    }
    public async Task<bool> VerifyEvent(IHeaderDictionary headerDictionary, string body) {
        var response = await GetAuthorizationRequest();
        SetToken(response.access_token);

        var baseUrl = _configuration["PayPal:BaseUrl"];
        var webhookId = _configuration["PayPal:WebhookId"];
        var paypalVerifyRequestJsonString = $@"{{
				""transmission_id"": ""{headerDictionary["PAYPAL-TRANSMISSION-ID"][0]}"",
				""transmission_time"": ""{headerDictionary["PAYPAL-TRANSMISSION-TIME"][0]}"",
				""cert_url"": ""{headerDictionary["PAYPAL-CERT-URL"][0]}"",
				""auth_algo"": ""{headerDictionary["PAYPAL-AUTH-ALGO"][0]}"",
				""transmission_sig"": ""{headerDictionary["PAYPAL-TRANSMISSION-SIG"][0]}"",
				""webhook_id"": ""{webhookId}"",
				""webhook_event"": {body}
				}}";

        var content = new StringContent(paypalVerifyRequestJsonString, Encoding.UTF8, "application/json");

        var resultResponse = await _httpClient.PostAsync($"{baseUrl}/v1/notifications/verify-webhook-signature", content);

        var responseBody = await resultResponse.Content.ReadAsStringAsync();

        var verifyWebhookResponse = JsonConvert.DeserializeObject<WebHookVerificationResponse>(responseBody)!;

        if (verifyWebhookResponse.verification_status != "SUCCESS") {
            return false;
        }

        return true;
    }
    public void SetToken(string token) {
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
    private void EnsureHttpClientCreated() {
        if (_httpClient == null) {
            CreateHttpClient();
        }
    }
}

