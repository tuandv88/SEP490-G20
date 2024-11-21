using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Files.Commands.DeleteFile;

[Authorize($"{PoliciesType.Administrator}")]
public record DeleteFileCommand(Guid LectureId, Guid FileId) : ICommand;

