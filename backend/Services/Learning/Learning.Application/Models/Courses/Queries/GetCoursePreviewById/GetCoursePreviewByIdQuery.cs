using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCoursePreviewById;
public record GetCoursePreviewByIdQuery(Guid Id) : IQuery<GetCoursePreviewByIdResult>;
public record GetCoursePreviewByIdResult(CoursePreviewDto Course);