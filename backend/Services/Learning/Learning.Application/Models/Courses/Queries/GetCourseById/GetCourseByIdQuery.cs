using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourseById;
public record GetCourseByIdQuery(Guid Id) : IQuery<GetCourseByIdResult>;
public record GetCourseByIdResult(CourseDto CourseDto);