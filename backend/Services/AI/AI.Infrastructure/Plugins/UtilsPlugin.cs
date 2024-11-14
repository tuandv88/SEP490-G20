using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class UtilsPlugin {
    public static string KEY = "X-API-KEY";
    public static string KEY_VALUE = "e313f010c0e6082bacba5f7000f103edabc67ecc";
    public static string SEARCH_URL = "https://google.serper.dev/search";
    public static HttpClient Client = new HttpClient();
    [KernelFunction]
    public static DateTime GetCurrentTime() {
        return DateTime.Now;
    }

    [KernelFunction, Description("Performs a web search using the provided keyword and retrieves detailed results in JSON format, including titles, links, snippets, and additional attributes if available.")]
    public static string SearchWebData(string keyword) {
        var request = new HttpRequestMessage(HttpMethod.Post, SEARCH_URL);
        request.Headers.Add(KEY, KEY_VALUE);
        var content = new StringContent("{\"q\":\"" + keyword + "\"}", null, "application/json");
        request.Content = content;
        var response = Client.SendAsync(request).Result;
        response.EnsureSuccessStatusCode();
        return response.Content.ReadAsStringAsync().Result;
    } 
}

