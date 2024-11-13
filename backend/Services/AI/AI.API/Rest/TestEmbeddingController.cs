#pragma warning disable SKEXP0001
using AI.API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.KernelMemory;
using Microsoft.KernelMemory.Context;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Embeddings;

namespace AI.API.Rest {
    [ApiController]
    public class TestEmbeddingController : ControllerBase {
        private readonly ITextEmbeddingGenerationService _textEmbeddingGenerationService;
        private readonly IChatCompletionService _chatCompletionService;
        private Kernel _kernel;
        private IKernelMemory _kernelMemory;
        public TestEmbeddingController(Kernel kernel, IKernelMemory kernelMemory) {
            _kernel = kernel;
            _kernelMemory = kernelMemory;
            //_textEmbeddingGenerationService = kernel.GetRequiredService<ITextEmbeddingGenerationService>();
            _chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        }

        //[HttpGet("/embedding")]
        //public async Task<ActionResult<ReadOnlyMemory<float>>> GenerateEmbeddingsAndSearchAsync() {
        //    // Upsert a record.
        //    string descriptionText = "Find me a hotel with happiness in mind.";

        //    // Generate the embedding.
        //    ReadOnlyMemory<float> searchEmbedding =
        //        await _textEmbeddingGenerationService.GenerateEmbeddingAsync(descriptionText);

        //    // Return the embedding as an Ok response.
        //    return Ok(searchEmbedding);
        //}
        [HttpPost("/chat")]
        public async Task<ActionResult<string>> ChatAsync(string question) {
            ChatHistory history = [];
            history.AddUserMessage(question);
            OpenAIPromptExecutionSettings openAIPromptExecutionSettings = new() {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
            };
            var result = _chatCompletionService.GetStreamingChatMessageContentsAsync(
              history,
              executionSettings: openAIPromptExecutionSettings);
            string fullMessage = "";
            await foreach (var content in result) {
                fullMessage += content.Content;
            }
            // Add the message to the chat history
            history.AddAssistantMessage(fullMessage);
            return fullMessage;
        }
        [HttpPost("/chat/rag")]
        public async Task<ActionResult<object>> ChatRAGAsync(string question) {
            // Fake session data
            //var sessions = new List<dynamic> {
            //    new {
            //        Id = 1,
            //        Title = "Exploring AI in Depth",
            //        Abstract = "An in-depth look at AI technologies and their applications.",
            //        Similarity = 0.75,
            //        Speakers = "John Doe, Jane Smith",
            //        ExternalId = "AI123",
            //        Start = DateTimeOffset.Now.AddDays(-1),
            //        End = DateTimeOffset.Now
            //    },
            //    new {
            //        Id = 2,
            //        Title = "Understanding Machine Learning",
            //        Abstract = "Basics and advanced concepts in Machine Learning.",
            //        Similarity = 0.65,
            //        Speakers = "Alice Johnson",
            //        ExternalId = "ML456",
            //        Start = DateTimeOffset.Now.AddDays(-2),
            //        End = DateTimeOffset.Now
            //    }
            //    // Add more fake data as needed
            //};

            //// Formatting sessions for input to OpenAI
            //string sessionDescriptions = string.Join("\r", sessions.Select(s =>
            //    $"{s.Title}|{s.Abstract}|{s.Speakers}|{s.Start}|{s.End}"));

            // Constructing chat history
            string sourceCode = "import java.math.BigInteger;\n\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        StringBuilder b1 = new StringBuilder();\n        ListNode f1 = l1;\n        while (f1 != null) {\n            b1.append(f1.val);\n            f1 = f1.next;\n        }\n        StringBuilder b2 = new StringBuilder();\n        ListNode f2 = l2;\n        while (f2 != null) {\n            b2.append(f2.val);\n            f2 = f2.next;\n        }\n        BigInteger number1 = new BigInteger(b1.reverse().toString());\n        BigInteger number2 = new BigInteger(b2.reverse().toString());\n\n        StringBuilder resultBd = new StringBuilder(number1.add(number2).toString());\n        String resultNumber = resultBd.reverse().toString();\n        ListNode result = null;\n        ListNode newNode = null;\n        for (int i = 0; i < resultNumber.length(); i++) {\n            int number = Integer.parseInt(resultNumber.charAt(i) + \"\");\n            newNode = new ListNode(number);\n            if(result == null){\n                result = newNode;\n            } else {\n                ListNode lastNode = result;\n                while (lastNode.next != null){\n                    lastNode = lastNode.next;\n                }\n                lastNode.next = newNode;\n            }\n        }\n        return result;\n    }\n}";
            ChatHistory history = new ChatHistory();
            //history.AddUserMessage(question);

            history.AddUserMessage($"""
                Bạn đang là một trợ lý lập trình thông minh giúp người học đánh giá và cải thiện mã nguồn của họ. Người dùng vừa chạy đoạn mã sau:

                {sourceCode}

                Dựa trên mã này, bạn cần:

                1. **Đưa ra đánh giá tổng quan**: Nhận xét về tính đúng đắn và hiệu quả của mã.
                2. **Đề xuất cải tiến**: Gợi ý cho người dùng những cách để tối ưu hóa mã về hiệu suất và độ rõ ràng, hoặc các phương pháp tốt hơn nếu có.
                3. **Hướng dẫn sửa lỗi (nếu có)**: Nếu mã có lỗi, hãy chỉ rõ nguyên nhân và cung cấp gợi ý sửa lỗi cụ thể.
                4. **Gợi ý học tập bổ sung**: Nếu có bất kỳ khái niệm nào cần nghiên cứu thêm, hãy đề xuất tài liệu hoặc chủ đề mà người dùng có thể tham khảo.

                Lưu ý: Hãy cung cấp phản hồi ngắn gọn, thân thiện và mang tính hỗ trợ, phù hợp với trình độ của người học.
                """);


            // Retrieving response from OpenAI
            string fullMessage = "";
            var result = _chatCompletionService.GetStreamingChatMessageContentsAsync(history);

            await foreach (var content in result) {
                fullMessage += content.Content;
            }
            history.AddAssistantMessage(fullMessage);

            // Splitting the response into 'answer' and 'thoughts'
            var responseParts = fullMessage.Split("###thoughts###", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            string answer = responseParts.ElementAtOrDefault(0) ?? "No answer provided.";
            string thoughts = responseParts.ElementAtOrDefault(1) ?? "No thoughts provided.";

            // Returning structured result
            return Ok(new { answer, thoughts });
        }
        [HttpPost("/document")]
        public async Task<ActionResult<string>> ImportDocumentAsync(IFormFile file) {
            var tags = new TagCollection {
                { "LectureId", Guid.NewGuid().ToString() }
            };
            var d = await _kernelMemory.ImportDocumentAsync(file.OpenReadStream(), file.FileName, Guid.NewGuid().ToString(), tags);
            return Ok(d);
        }
        [HttpPost("/markdown")]
        public async Task<ActionResult<string>> ImportMarkdownAsync([FromBody]string markdown) {

            var d = await _kernelMemory.ImportTextAsync(markdown, Guid.NewGuid().ToString());
            return Ok(d);
        }

        [HttpPost("/web")]
        public async Task<ActionResult<string>> ImportWebAsync(string url) {

            var d = await _kernelMemory.ImportWebPageAsync(url, Guid.NewGuid().ToString());
            return Ok(d);
        }
        [HttpGet("/export")]
        public async Task<IActionResult> ExportDocumentAsync(string documentId, string fileName) {
            // Lấy StreamableFileContent từ KernelMemory
            var fileContent = await _kernelMemory.ExportFileAsync(documentId, fileName);

            // Lấy stream chứa nội dung file
            var stream = await fileContent.GetStreamAsync();
            // Trả về file với tên file và kiểu nội dung
            return File(stream, fileContent.FileType, fileContent.FileName);
        }
        [HttpGet("/ask")]
        public async Task<IActionResult> AskRag(string question) {
            var answer = await _kernelMemory.AskAsync(question);
            //, minRelevance: 0.4
            return Ok(answer);
        }
        [HttpGet("/search")]
        public async Task<IActionResult> Search(string question) {
            var d = new Dictionary<string, object> {
                { Constants.CustomContext.Rag.Temperature, 1.5 }
            };
            var context = new RequestContext(d);
            //SearchClient
            var answer = await _kernelMemory.SearchAsync(question, minRelevance: 0.4);

            return Ok(answer.ToJson(true));
        }
        [HttpGet("/ask-rag-prompt")]
        public async Task<IActionResult> AskRagPrompt(string question) {
            var prompt = $@"c
                Question to Kernel Memory: {question}

                Kernel Memory Answer: {{memory.ask}}

                If there is an answer from Kernel Memory, use it as the main response. If not, answer the question directly. Follow this response structure:
                - Provide a brief answer.
                - Offer detailed explanation.
                - Add a real-world example if relevant.
                - Suggest further study tips.
                - Include reference links if available.
                ";

            AzureOpenAIPromptExecutionSettings settings = new() {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
            };
            var chatHistory = new ChatHistory();
            var chatCompletionService = _kernel.GetRequiredService<IChatCompletionService>();
            chatHistory.AddMessage(AuthorRole.User, prompt);

            var result = await chatCompletionService.GetChatMessageContentAsync(chatHistory, settings, _kernel);
            dynamic a = new { result, result.Content };
            return Ok(result);
        }

    }
}
#pragma warning disable SKEXP0001
