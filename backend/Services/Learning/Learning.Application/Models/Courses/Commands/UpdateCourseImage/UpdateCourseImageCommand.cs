using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Commands.UpdateCourseImage;
public record UpdateCourseImageCommand(Guid CourseId, ImageDto ImageDto) : ICommand<UpdateCourseImageResult>;
public record UpdateCourseImageResult(string PresignedUrl);

