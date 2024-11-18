using AI.Application.Common.Constants;
using BuidingBlocks.Storage.Interfaces;
using BuidingBlocks.Storage.Models;
using Microsoft.KernelMemory;

namespace AI.Infrastructure.Services;
public class DocumentService(IFilesService filesService, AWSS3Config config) : IDocumentService {


    //Dùng S3 lấy ra document link
    //"link": "default/9769acc8-8d14-406a-83e7-716e4afdea97/1b2dec2c9ba54b32ace886c2edbccdb7",
    //"index": "default",
    //"documentId": "9769acc8-8d14-406a-83e7-716e4afdea97",
    //"fileId": "1b2dec2c9ba54b32ace886c2edbccdb7",
    //"sourceContentType": "text/x-uri",
    //"sourceName": "content.url",
    //"sourceUrl": "https://www.w3schools.com/js/js_syntax.asp",
    public async Task<List<string>> GetDocumentMarkdownLinks(List<string> documentIds, MemoryAnswer answer) {
        var uniqueCitations = answer.RelevantSources
            .GroupBy(x => x.DocumentId)
            .Select(group => group.First())
            .Where(citation => documentIds.Contains(citation.DocumentId))
            .ToList();

        var fileMarkdowns = new List<string>();
        foreach (var citation in uniqueCitations) {
            string filePath;
            string markdownLink;
            if (citation.SourceName == DocumentConstant.Name.ContentUrl) {
                filePath = citation.SourceUrl!; // Đây là một page rồi
                markdownLink = $"[{filePath}]({filePath})";
                fileMarkdowns.Add(markdownLink);
            } else {
                filePath = $"{citation.Index}/{citation.DocumentId}/{citation.SourceName}";
                var s3ObjectDto = await filesService.GetFileAsync(config.BucketName, filePath, 60 * 24 * 7);
                markdownLink = $"[{citation.SourceName}]({s3ObjectDto.PresignedUrl!})";
                fileMarkdowns.Add(markdownLink);
            }
        }
        return fileMarkdowns;
    }

    public async Task<List<string>> GetDocumentMarkdownLinks(List<Domain.Models.Document> documents) {
        var fileMarkdowns = new List<string>();

        foreach (var document in documents) {
            string markdownLink;
            if (document.FileName == DocumentConstant.Name.ContentUrl) {
                document.Tags.TryGetValue(TagConstant.Key.Url, out var url);
                markdownLink = $"[{url}]({url})";
            } else {
                string filePath = $"{document.Index}/{document.Id.Value}/{document.FileName}";
                var s3ObjectDto = await filesService.GetFileAsync(config.BucketName, filePath, 60 * 24 * 7);
                markdownLink = $"[{document.FileName}]({s3ObjectDto.PresignedUrl!})";
            }
            fileMarkdowns.Add(markdownLink);
        }

        return fileMarkdowns;
    }

    public async Task<string> GetDocumentLink(Domain.Models.Document document) {
        var filePath = $"{document.Index}/{document.Id.Value}/{document.FileName}";
        var s3ObjectDto = await filesService.GetFileAsync(config.BucketName, filePath, 60 * 24 * 7);
        return s3ObjectDto.PresignedUrl!;
    }
}

