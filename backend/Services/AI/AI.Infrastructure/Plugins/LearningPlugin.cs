using Microsoft.KernelMemory;
using Newtonsoft.Json;
using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class LearningPlugin(IKernelMemory kernelMemory) {

    [KernelFunction, Description("Retrieves detailed information about a lecture based on the provided LectureId.")]
    public async Task<string?> GetLectureDetails(
        Guid LectureId
        ) {
        return await Utils.SearchDocument(kernelMemory, LectureId.ToString());
    }
    [KernelFunction, Description("Retrieves information about a chapter based on the provided ChapterId.")]
    public async Task<string> GetChapter(
        Guid ChapterId
        ) {
        return await Utils.SearchDocument(kernelMemory, ChapterId.ToString());
    }
    [KernelFunction, Description("Retrieves information about a course based on the provided CourseId.")]
    public async Task<string> GetCourse(
        Guid CourseId
        ) {
        return await Utils.SearchDocument(kernelMemory, CourseId.ToString());
    }
}
internal static class Utils {
    public static async Task<string> SearchDocument(IKernelMemory memory, string documentId, string index = "default") {
        var filter = MemoryFilters.ByDocument(documentId);
        var searchResult = await memory.SearchAsync("", index, filter: filter);
        var citation = searchResult.Results.FirstOrDefault();
        var listResults = new List<string>();
        if (citation != null) {
            listResults.AddRange(citation.Partitions.Select(p => p.Text));
        }
        return JsonConvert.SerializeObject(listResults);
    }
}
