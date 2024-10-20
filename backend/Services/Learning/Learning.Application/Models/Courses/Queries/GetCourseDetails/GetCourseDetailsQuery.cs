using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourseDetails;
public record GetCourseDetailsQuery(Guid Id) : IQuery<GetCourseDetailsResult>;
public record GetCourseDetailsResult(CourseDetailsDto CourseDetailsDto);

