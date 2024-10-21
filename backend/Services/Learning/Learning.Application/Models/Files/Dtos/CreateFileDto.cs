using Microsoft.AspNetCore.Http;

namespace Learning.Application.Models.Files.Dtos;
public record CreateFileDto(IFormFile File, string? Duration, string FileType);

