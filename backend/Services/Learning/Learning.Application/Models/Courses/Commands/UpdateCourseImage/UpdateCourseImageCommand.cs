using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Commands.UpdateCourseImage;
[Authorize(Roles = $"{RoleType.Administrator}")]
public record UpdateCourseImageCommand(Guid CourseId, ImageDto ImageDto) : ICommand<UpdateCourseImageResult>;
public record UpdateCourseImageResult(string PresignedUrl);

