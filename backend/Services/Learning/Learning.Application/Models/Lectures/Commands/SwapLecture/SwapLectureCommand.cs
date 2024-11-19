using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Lectures.Commands.SwapLecture;

[Authorize(Roles = $"{RoleType.Administrator}")]
public record SwapLectureCommand(Guid LectureId1, Guid LectureId2): ICommand<SwapLectureResult>;
public record SwapLectureResult(int OrderIndexLecture1, int OrderIndexLecture2);

