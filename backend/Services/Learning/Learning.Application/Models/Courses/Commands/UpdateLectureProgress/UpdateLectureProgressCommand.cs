using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.UpdateLectureProgress;

[Authorize]
public record UpdateLectureProgressCommand(Guid CourseId, Guid LectureId, long Duration) : ICommand<UpdateLectureProgressResult>;
public record UpdateLectureProgressResult(bool IsSuccess);
